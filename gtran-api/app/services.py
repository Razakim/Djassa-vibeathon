from __future__ import annotations

from app.domain.alerts_engine import compute_alerts
from app.domain.mission_workflow import refresh_store_alerts, uid
from app.schemas import (
    AppStore,
    Document,
    Driver,
    Employee,
    FuelRecord,
    Invoice,
    MaintenanceItem,
    Message,
    Payment,
    Vehicle,
)

CLS_MAP = {
    "vehicles": Vehicle,
    "drivers": Driver,
    "documents": Document,
    "invoices": Invoice,
    "payments": Payment,
    "maintenanceItems": MaintenanceItem,
    "fuelRecords": FuelRecord,
    "employees": Employee,
    "messages": Message,
}


def filter_agence(items, agence_id: str | None):
    if not agence_id:
        return items
    return [i for i in items if i.agenceId == agence_id]


def list_collection(store: AppStore, key: str, agence_id: str | None = None):
    return filter_agence(getattr(store, key), agence_id)


def create_item(store: AppStore, key: str, data: dict) -> AppStore:
    cls = CLS_MAP[key]
    items = list(getattr(store, key))
    entry = {**data, "id": data.get("id") or uid(key[:3])}
    items.append(cls.model_validate(entry))
    return refresh_store_alerts(store.model_copy(update={key: items}))


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
    return refresh_store_alerts(store.model_copy(update={key: items})), updated


def delete_item(store: AppStore, key: str, item_id: str) -> AppStore:
    items = [i for i in getattr(store, key) if i.id != item_id]
    return refresh_store_alerts(store.model_copy(update={key: items}))


def search_global(store: AppStore, query: str, agence_id: str | None = None):
    q = query.lower()
    missions = [m for m in filter_agence(store.missions, agence_id) if q in m.id.lower() or q in m.client.lower()]
    vehicles = [
        v for v in filter_agence(store.vehicles, agence_id)
        if q in v.immatriculation.lower() or q in (v.chauffeur or "").lower()
    ]
    drivers = [d for d in filter_agence(store.drivers, agence_id) if q in d.nom.lower()]
    return {"missions": missions, "vehicles": vehicles, "drivers": drivers}
