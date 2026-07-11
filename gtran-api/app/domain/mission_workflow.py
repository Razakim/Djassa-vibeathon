from __future__ import annotations

from datetime import datetime, timedelta

from app.domain.alerts_engine import compute_alerts
from app.geo import build_route
from app.schemas import AppStore, Invoice, Message, Mission, MissionCreateInput, MissionTransitionResult

ACTIVE_MISSION_STATUSES = {"planifiee", "en_cours", "en_retard"}
LOCKED_RESOURCE_STATUSES = {"planifiee", "en_cours", "en_retard"}

VALID_TRANSITIONS: dict[str, list[str]] = {
    "planifiee": ["en_cours", "annulee"],
    "en_cours": ["livree", "en_retard", "annulee"],
    "en_retard": ["livree", "en_cours", "annulee"],
    "livree": [],
    "annulee": [],
}


def uid(prefix: str) -> str:
    import time

    return f"{prefix}-{int(time.time() * 1000):x}"


def _is_driver_busy(store: AppStore, driver_id: str, exclude: str | None = None) -> bool:
    return any(
        m.driverId == driver_id and m.statut in ACTIVE_MISSION_STATUSES and m.id != exclude
        for m in store.missions
    )


def _is_vehicle_busy(store: AppStore, vehicle_id: str, exclude: str | None = None) -> bool:
    return any(
        m.vehicleId == vehicle_id and m.statut in ACTIVE_MISSION_STATUSES and m.id != exclude
        for m in store.missions
    )


def _pick_driver(store: AppStore, agence_id: str) -> str | None:
    for d in store.drivers:
        if d.agenceId == agence_id and d.statut == "disponible" and not _is_driver_busy(store, d.id):
            return d.id
    return None


def _pick_vehicle(store: AppStore, agence_id: str) -> str | None:
    for v in store.vehicles:
        if v.agenceId == agence_id and v.statut == "disponible" and not _is_vehicle_busy(store, v.id):
            return v.id
    return None


def sync_resource_locks(store: AppStore) -> AppStore:
    locked_drivers: set[str] = set()
    locked_vehicles: set[str] = set()

    for m in store.missions:
        if m.statut in LOCKED_RESOURCE_STATUSES:
            locked_drivers.add(m.driverId)
            locked_vehicles.add(m.vehicleId)

    drivers = []
    for d in store.drivers:
        if d.id in locked_drivers:
            drivers.append(d.model_copy(update={"statut": "en_mission"}))
        elif d.statut == "en_mission":
            drivers.append(d.model_copy(update={"statut": "disponible"}))
        else:
            drivers.append(d)

    vehicles = []
    for v in store.vehicles:
        if v.id in locked_vehicles:
            mission = next(
                (m for m in store.missions if m.vehicleId == v.id and m.statut in LOCKED_RESOURCE_STATUSES),
                None,
            )
            driver = next((d for d in store.drivers if d.id == mission.driverId), None) if mission else None
            vehicles.append(
                v.model_copy(
                    update={
                        "statut": "en_mission",
                        "chauffeur": driver.nom if driver else v.chauffeur,
                        "driverId": mission.driverId if mission else v.driverId,
                        "disponibilite": 0,
                    }
                )
            )
        elif v.statut == "en_mission":
            vehicles.append(
                v.model_copy(update={"statut": "disponible", "chauffeur": None, "driverId": None, "disponibilite": 100})
            )
        else:
            vehicles.append(v)

    partial = store.model_copy(update={"drivers": drivers, "vehicles": vehicles})
    return partial.model_copy(update={"alerts": compute_alerts(partial)})


def create_mission_in_store(store: AppStore, input: MissionCreateInput) -> AppStore:
    driver_id = input.driverId or _pick_driver(store, input.agenceId)
    vehicle_id = input.vehicleId or _pick_vehicle(store, input.agenceId)

    if not driver_id:
        raise ValueError("Aucun chauffeur disponible")
    if not vehicle_id:
        raise ValueError("Aucun véhicule disponible")
    if _is_driver_busy(store, driver_id):
        raise ValueError("Chauffeur déjà assigné à une mission active")
    if _is_vehicle_busy(store, vehicle_id):
        raise ValueError("Véhicule déjà assigné à une mission active")

    driver = next((d for d in store.drivers if d.id == driver_id), None)
    vehicle = next((v for v in store.vehicles if v.id == vehicle_id), None)
    if not driver:
        raise ValueError("Chauffeur introuvable")
    if not vehicle:
        raise ValueError("Véhicule introuvable")

    if vehicle.statut not in ("disponible", "en_mission"):
        raise ValueError(f"Véhicule {vehicle.immatriculation} indisponible ({vehicle.statut})")
    if driver.statut not in ("disponible", "en_mission"):
        raise ValueError(f"Chauffeur {driver.nom} indisponible ({driver.statut})")

    mission = Mission(
        id=uid("M"),
        client=input.client,
        depart=input.depart,
        destination=input.destination,
        marchandise=input.marchandise,
        poids=input.poids,
        driverId=driver_id,
        vehicleId=vehicle_id,
        chauffeur=driver.nom,
        vehicule=vehicle.immatriculation,
        statut=input.statut or "planifiee",
        prix=input.prix,
        cout=input.cout,
        agenceId=input.agenceId,
        route=build_route(input.depart, input.destination),
        progress=0.0,
        createdAt=datetime.utcnow().isoformat() + "Z",
    )

    msg = Message(
        id=uid("msg"),
        **{
            "from": "Système",
            "subject": f"Mission {mission.id} créée",
            "body": f"{mission.client} — {mission.depart} → {mission.destination}. Chauffeur {driver.nom}, véhicule {vehicle.immatriculation}.",
            "time": "À l'instant",
            "unread": True,
            "agenceId": input.agenceId,
        },
    )

    return sync_resource_locks(
        store.model_copy(update={"missions": [*store.missions, mission], "messages": [*store.messages, msg]})
    )


def transition_mission_in_store(store: AppStore, mission_id: str, next_status: str) -> tuple[AppStore, MissionTransitionResult]:
    mission = next((m for m in store.missions if m.id == mission_id), None)
    if not mission:
        raise ValueError("Mission introuvable")

    if next_status not in VALID_TRANSITIONS.get(mission.statut, []):
        raise ValueError(f"Transition {mission.statut} → {next_status} non autorisée")

    progress = mission.progress
    if next_status == "en_cours":
        progress = 0.15
    elif next_status == "en_retard":
        progress = max(progress, 0.72)
    elif next_status == "livree":
        progress = 1.0
    elif next_status == "annulee":
        progress = 0.0

    missions = [m.model_copy(update={"statut": next_status, "progress": progress}) if m.id == mission_id else m for m in store.missions]
    invoices = list(store.invoices)
    messages = list(store.messages)
    documents = list(store.documents)
    invoice: Invoice | None = None
    message: Message | None = None

    if next_status == "livree":
        due = (datetime.utcnow() + timedelta(days=30)).strftime("%Y-%m-%d")
        invoice = Invoice(
            id=uid("F"),
            client=mission.client,
            montant=mission.prix,
            echeance=due,
            statut="en_attente",
            agenceId=mission.agenceId,
            missionId=mission.id,
        )
        invoices.append(invoice)
        from app.schemas import Document

        documents.append(
            Document(
                id=uid("doc"),
                type="Bon de livraison",
                entite=mission.id,
                expiration=due,
                statut="valide",
                agenceId=mission.agenceId,
                missionId=mission.id,
            )
        )
        message = Message(
            id=uid("msg"),
            **{
                "from": "Système",
                "subject": f"Livraison confirmée — {mission.id}",
                "body": f"Mission {mission.id} livrée. Facture {invoice.id} générée pour {mission.client} ({int(mission.prix):,} XOF).".replace(",", " "),
                "time": "À l'instant",
                "unread": True,
                "agenceId": mission.agenceId,
            },
        )
        messages.append(message)

    if next_status == "annulee":
        message = Message(
            id=uid("msg"),
            **{
                "from": "Système",
                "subject": f"Mission annulée — {mission.id}",
                "body": f"La mission {mission.id} ({mission.depart} → {mission.destination}) a été annulée. Véhicule et chauffeur libérés.",
                "time": "À l'instant",
                "unread": True,
                "agenceId": mission.agenceId,
            },
        )
        messages.append(message)

    if next_status == "en_cours":
        message = Message(
            id=uid("msg"),
            **{
                "from": "Système",
                "subject": f"Mission démarrée — {mission.id}",
                "body": f"{mission.chauffeur} a pris la route avec {mission.vehicule} ({mission.depart} → {mission.destination}).",
                "time": "À l'instant",
                "unread": True,
                "agenceId": mission.agenceId,
            },
        )
        messages.append(message)

    next_store = sync_resource_locks(
        store.model_copy(update={"missions": missions, "invoices": invoices, "messages": messages, "documents": documents})
    )
    updated = next((m for m in next_store.missions if m.id == mission_id), mission)
    return next_store, MissionTransitionResult(mission=updated, invoice=invoice, message=message)


def delete_mission_in_store(store: AppStore, mission_id: str) -> AppStore:
    mission = next((m for m in store.missions if m.id == mission_id), None)
    if not mission:
        return store
    if mission.statut in ("en_cours", "en_retard"):
        raise ValueError("Impossible de supprimer une mission en cours — annulez-la d'abord")
    return sync_resource_locks(store.model_copy(update={"missions": [m for m in store.missions if m.id != mission_id]}))


def refresh_store_alerts(store: AppStore) -> AppStore:
    return store.model_copy(update={"alerts": compute_alerts(store)})
