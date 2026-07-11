from __future__ import annotations

from app.domain.alerts_engine import compute_alerts
from app.domain.mission_workflow import (
    create_mission_in_store,
    delete_mission_in_store,
    refresh_store_alerts,
    transition_mission_in_store,
    uid,
)
from app.domain.tracking import derive_tracking, process_invoice_reminders
from app.schemas import AppStore, MissionCreateInput, Message


def _with_alerts(store: AppStore) -> AppStore:
    return refresh_store_alerts(store)


def filter_agence(items, agence_id: str | None):
    if not agence_id:
        return items
    return [i for i in items if getattr(i, "agenceId", None) == agence_id]


def list_collection(store: AppStore, key: str, agence_id: str | None = None):
    items = getattr(store, key)
    return filter_agence(items, agence_id)


def create_item(store: AppStore, key: str, data: dict) -> AppStore:
    items = list(getattr(store, key))
    entry = {**data, "id": data.get("id") or uid(key[:3])}
    model_cls = type(items[0]) if items else None
  # fallback - use pydantic from store field annotation
    from app.schemas import (
        Document, Driver, Employee, FuelRecord, Invoice, MaintenanceItem,
        Message, Payment, Vehicle,
    )
    cls_map = {
        "vehicles": Vehicle, "drivers": Driver, "documents": Document,
        "invoices": Invoice, "payments": Payment, "maintenanceItems": MaintenanceItem,
        "fuelRecords": FuelRecord, "employees": Employee, "messages": Message,
    }
    cls = cls_map.get(key, Vehicle)
    items.append(cls.model_validate(entry))
    return _with_alerts(store.model_copy(update={key: items}))


def update_item(store: AppStore, key: str, item_id: str, patch: dict) -> tuple[AppStore, object]:
    items = []
    updated = None
    for item in getattr(store, key):
        if item.id == item_id:
            updated = item.model_copy(update=patch)
            items.append(updated)
        else:
            items.append(item)
    if updated is None:
        raise ValueError("Élément introuvable")
    return _with_alerts(store.model_copy(update={key: items})), updated


def delete_item(store: AppStore, key: str, item_id: str) -> AppStore:
    items = [i for i in getattr(store, key) if i.id != item_id]
    return _with_alerts(store.model_copy(update={key: items}))


def search_global(store: AppStore, query: str, agence_id: str | None = None):
    q = query.lower()
    missions = [m for m in filter_agence(store.missions, agence_id) if q in m.id.lower() or q in m.client.lower()]
    vehicles = [
        v for v in filter_agence(store.vehicles, agence_id)
        if q in v.immatriculation.lower() or q in (v.chauffeur or "").lower()
    ]
    drivers = [d for d in filter_agence(store.drivers, agence_id) if q in d.nom.lower()]
    return {"missions": missions, "vehicles": vehicles, "drivers": drivers}


def answer_ai_query(store: AppStore, query: str, agence_id: str | None = None) -> str:
    q = query.lower()

    if "retard" in q and "client" in q or ("client" in q and "payer" in q):
        overdue = [i for i in filter_agence(store.invoices, agence_id) if i.statut in ("en_retard", "partiel")]
        if not overdue:
            return "Aucun client en retard de paiement pour cette agence."
        lines = [f"• {i.client} — {i.id}, {int(i.montant):,} XOF".replace(",", " ") for i in overdue]
        return "Clients avec paiements en retard :\n" + "\n".join(lines)

    if "retard" in q and "mission" in q:
        late = [m for m in filter_agence(store.missions, agence_id) if m.statut == "en_retard"]
        if not late:
            return "Aucune mission en retard actuellement."
        return "Missions en retard :\n" + "\n".join(
            f"• {m.id} ({m.client}, {m.depart}→{m.destination})" for m in late
        )

    active = [m for m in filter_agence(store.missions, agence_id) if m.statut in ("en_cours", "en_retard")]
    dispo = len([v for v in filter_agence(store.vehicles, agence_id) if v.statut == "disponible"])
    alerts_n = len(compute_alerts(store, agence_id))
    if "résum" in q or "resum" in q or "tournée" in q:
        return (
            f"Résumé opérationnel :\n• {len(active)} mission(s) en cours\n"
            f"• {dispo} véhicule(s) disponible(s)\n• {alerts_n} alerte(s) active(s)"
        )

    return (
        "Je peux répondre sur : clients en retard, missions en retard, résumé opérationnel. "
        "Posez une question précise."
    )
