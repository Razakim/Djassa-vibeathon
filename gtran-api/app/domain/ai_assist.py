from __future__ import annotations

import re

from app.domain.alerts_engine import compute_alerts
from app.domain.mission_profit import compute_mission_profit, format_mission_profit_text
from app.schemas import AppStore


def _filter_agence(items, agence_id: str | None):
    if not agence_id:
        return items
    return [i for i in items if getattr(i, "agenceId", None) == agence_id]


def _fmt(n: float | int) -> str:
    return f"{int(n):,}".replace(",", " ")


def answer_ai_query(store: AppStore, query: str, agence_id: str | None = None) -> str:
    q = query.lower()

    if "coûté le plus cher" in q or "couté le plus cher" in q or ("camion" in q and "cher" in q):
        costs = []
        for vehicle in _filter_agence(store.vehicles, agence_id):
            fuel = sum(f.montant for f in _filter_agence(store.fuelRecords, agence_id) if f.vehicleId == vehicle.id)
            maint = len([m for m in _filter_agence(store.maintenanceItems, agence_id) if m.vehicleId == vehicle.id]) * 150_000
            costs.append({"immat": vehicle.immatriculation, "total": fuel + maint + vehicle.km * 50})
        costs.sort(key=lambda c: c["total"], reverse=True)
        top = costs[:3]
        if not top:
            return "Aucun véhicule trouvé pour cette agence."
        return "Camions les plus coûteux (carburant + maintenance estimée) :\n" + "\n".join(
            f"{i + 1}. {c['immat']} — {_fmt(c['total'])} XOF" for i, c in enumerate(top)
        )

    if "client" in q and ("retard" in q or "payer" in q or "payent" in q):
        overdue = [i for i in _filter_agence(store.invoices, agence_id) if i.statut in ("en_retard", "partiel")]
        by_client: dict[str, dict] = {}
        for inv in overdue:
            cur = by_client.get(inv.client, {"count": 0, "montant": 0})
            by_client[inv.client] = {"count": cur["count"] + 1, "montant": cur["montant"] + inv.montant}
        if not by_client:
            return "Aucun client en retard de paiement pour cette agence."
        lines = sorted(by_client.items(), key=lambda x: x[1]["montant"], reverse=True)
        return "Clients avec paiements en retard :\n" + "\n".join(
            f"• {client} — {data['count']} facture(s), {_fmt(data['montant'])} XOF" for client, data in lines
        ) + "\n\nRelances automatiques actives pour les factures en retard."

    if "bénéfice" in q or "benefice" in q or re.search(r"m-[a-z0-9]+", q, re.I):
        match = re.search(r"m-[a-z0-9]+", q, re.I)
        missions = _filter_agence(store.missions, agence_id)
        mission = None
        if match:
            mission = next((m for m in missions if m.id.lower() == match.group(0).lower()), None)
        if not mission:
            mission = next((m for m in missions if m.statut in ("en_cours", "livree")), None)
        if not mission:
            return "Mission introuvable. Précisez l'ID (ex. M-2048)."
        breakdown = compute_mission_profit(mission, _filter_agence(store.fuelRecords, agence_id))
        return format_mission_profit_text(mission, breakdown)

    if "retard" in q and "mission" in q:
        late = [m for m in _filter_agence(store.missions, agence_id) if m.statut == "en_retard"]
        if not late:
            return "Aucune mission en retard actuellement."
        return "Missions en retard :\n" + "\n".join(
            f"• {m.id} ({m.client}, {m.depart}→{m.destination}) — {m.chauffeur}, {m.vehicule}" for m in late
        )

    if "résum" in q or "resum" in q or "tournée" in q or "tournee" in q:
        missions = _filter_agence(store.missions, agence_id)
        active = [m for m in missions if m.statut in ("en_cours", "en_retard")]
        planned = [m for m in missions if m.statut == "planifiee"]
        dispo = len([v for v in _filter_agence(store.vehicles, agence_id) if v.statut == "disponible"])
        alerts_n = len(compute_alerts(store, agence_id))
        lines = [
            "Résumé opérationnel :",
            f"• {len(active)} mission(s) en cours",
            f"• {len(planned)} planifiée(s)",
            f"• {dispo} véhicule(s) disponible(s)",
            f"• {alerts_n} alerte(s) active(s)",
        ]
        if active:
            lines.append("\nEn route :")
            lines.extend(f"• {m.id} : {m.depart}→{m.destination} ({int(m.progress * 100)}%)" for m in active)
        return "\n".join(lines)

    if "disponible" in q and "chauffeur" in q:
        dispo = [d for d in _filter_agence(store.drivers, agence_id) if d.statut == "disponible"]
        if not dispo:
            return "Aucun chauffeur disponible."
        return "Chauffeurs disponibles :\n" + "\n".join(
            f"• {d.nom} ({d.categorie}, ponctualité {d.ponctualite}%)" for d in dispo
        )

    return (
        "Je peux répondre sur : coûts par camion, clients en retard, bénéfice d'une mission, "
        "missions en retard, résumé de tournée, chauffeurs disponibles. Posez une question précise."
    )
