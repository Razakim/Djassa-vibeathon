from __future__ import annotations

from datetime import datetime

from app.domain.alerts_engine import compute_alerts
from app.domain.mission_workflow import refresh_store_alerts, uid
from app.geo import build_route, get_city_coords, get_route_bearing, interpolate_route
from app.schemas import AppStore, Message, TrackingVehicle


def process_invoice_reminders(store: AppStore) -> AppStore:
    today = datetime.utcnow().strftime("%Y-%m-%d")
    messages = list(store.messages)
    invoices = []

    for inv in store.invoices:
        updated = inv
        if inv.statut == "paye":
            invoices.append(updated)
            continue
        if inv.echeance < today and inv.statut in ("en_attente", "partiel"):
            updated = inv.model_copy(update={"statut": "en_retard"})
        if updated.statut == "en_retard" and updated.lastReminderAt != today:
            overdue = (datetime.strptime(today, "%Y-%m-%d") - datetime.strptime(inv.echeance, "%Y-%m-%d")).days
            if overdue >= 1:
                msg = Message(
                    id=uid("msg"),
                    **{
                        "from": "Système",
                        "subject": f"Relance automatique — {inv.id}",
                        "body": f"Relance envoyée à {inv.client} : facture {inv.id} impayée depuis {overdue} jour(s) ({int(inv.montant):,} XOF).".replace(",", " "),
                        "time": "À l'instant",
                        "unread": True,
                        "agenceId": inv.agenceId,
                    },
                )
                messages.append(msg)
                updated = updated.model_copy(update={"lastReminderAt": today})
        invoices.append(updated)

    return refresh_store_alerts(store.model_copy(update={"invoices": invoices, "messages": messages}))


def _mission_position(mission) -> tuple[float, float]:
    if mission.statut == "planifiee":
        return mission.route[0] if mission.route else get_city_coords(mission.depart)
    if mission.statut in ("livree", "annulee"):
        return mission.route[-1] if mission.route else get_city_coords(mission.destination)
    return interpolate_route(mission.route, mission.progress)


def _position_label(mission) -> str:
    if mission.statut == "planifiee":
        return f"{mission.depart} (dépôt)"
    if mission.statut == "livree":
        return f"{mission.destination} (livré)"
    return f"En route — {int(mission.progress * 100)}%"


def _tracking_statut(mission) -> str:
    if mission.statut == "planifiee":
        return "disponible"
    if mission.statut == "en_retard":
        return "arret"
    if mission.progress < 0.1:
        return "arret"
    return "en_route"


def _vitesse_for(mission) -> int:
    if mission.statut in ("planifiee", "livree", "en_retard"):
        return 0
    return 55 + int(mission.progress * 30)


def derive_tracking(store: AppStore, agence_id: str | None = None) -> list[TrackingVehicle]:
    missions = [m for m in store.missions if not agence_id or m.agenceId == agence_id]
    vehicles = [v for v in store.vehicles if not agence_id or v.agenceId == agence_id]

    active_vehicle_ids = {
        m.vehicleId
        for m in missions
        if m.statut in ("en_cours", "en_retard", "planifiee")
    }

    result: list[TrackingVehicle] = []

    for m in missions:
        if m.statut in ("annulee", "livree"):
            continue
        vtype = next((v.type for v in store.vehicles if v.id == m.vehicleId), None)
        coords = _mission_position(m)
        result.append(
            TrackingVehicle(
                id=f"track-{m.id}",
                immatriculation=m.vehicule,
                chauffeur=m.chauffeur,
                vitesse=_vitesse_for(m),
                position=_position_label(m),
                statut=_tracking_statut(m),
                arret="2h30" if m.statut == "en_retard" else ("15 min" if m.progress < 0.1 else "—"),
                coords=coords,
                heading=get_route_bearing(m.route, max(m.progress, 0.01)) if m.statut != "planifiee" else 0,
                vehicleType=vtype,
                missionStatut=m.statut,
                missionId=m.id,
                vehicleId=m.vehicleId,
                driverId=m.driverId,
            )
        )

    for v in vehicles:
        if v.id in active_vehicle_ids or v.statut == "en_mission":
            continue
        coords = v.position or get_city_coords("Abidjan")
        pos = "Atelier" if v.statut == "maintenance" else ("Immobilisé" if v.statut == "immobilise" else "Garage")
        result.append(
            TrackingVehicle(
                id=f"track-idle-{v.id}",
                immatriculation=v.immatriculation,
                chauffeur=v.chauffeur or "—",
                vitesse=0,
                position=pos,
                statut="disponible" if v.statut == "disponible" else "arret",
                arret="—",
                coords=coords,
                heading=0,
                vehicleType=v.type,
                vehicleId=v.id,
                driverId=v.driverId,
            )
        )

    return result
