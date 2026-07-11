from __future__ import annotations

from datetime import datetime

from app.schemas import Alert, AppStore


def _days_until(date_str: str) -> int:
    exp = datetime.strptime(date_str[:10], "%Y-%m-%d")
    now = datetime.now()
    return int((exp - now).total_seconds() / 86400 + 0.999)


def _days_since(date_str: str) -> int:
    d = datetime.strptime(date_str[:10], "%Y-%m-%d")
    return int((datetime.now() - d).total_seconds() / 86400)


def compute_alerts(store: AppStore, agence_id: str | None = None) -> list[Alert]:
    alerts: list[Alert] = []

    def scope(items):
        return [i for i in items if not agence_id or i.agenceId == agence_id]

    for doc in scope(store.documents):
        days = _days_until(doc.expiration)
        if 0 <= days <= 30:
            alerts.append(
                Alert(
                    id=f"alert-doc-{doc.id}",
                    type="document",
                    message=f"{doc.type} — {doc.entite} expire dans {days} jour{'s' if days > 1 else ''}",
                    severity="danger" if days <= 15 else "warning",
                    agenceId=doc.agenceId,
                    entityId=doc.id,
                    href="/documents",
                )
            )

    for item in scope(store.maintenanceItems):
        if item.kmRestant <= 500:
            msg = "due maintenant" if item.kmRestant <= 0 else f"dans {item.kmRestant} km"
            alerts.append(
                Alert(
                    id=f"alert-maint-{item.id}",
                    type="maintenance",
                    message=f"{item.vehicule} — {item.type} ({msg})",
                    severity="danger" if item.priorite == "critique" or item.kmRestant <= 0 else "warning",
                    agenceId=item.agenceId,
                    entityId=item.id,
                    href="/maintenance",
                )
            )

    for mission in scope(store.missions):
        if mission.statut == "en_retard":
            alerts.append(
                Alert(
                    id=f"alert-mission-{mission.id}",
                    type="mission",
                    message=f"Mission {mission.id} en retard — {mission.depart} → {mission.destination}",
                    severity="danger",
                    agenceId=mission.agenceId,
                    entityId=mission.id,
                    href="/missions",
                )
            )

    for invoice in scope(store.invoices):
        if invoice.statut == "en_retard":
            alerts.append(
                Alert(
                    id=f"alert-inv-{invoice.id}",
                    type="paiement",
                    message=f"Facture {invoice.id} impayée — {invoice.client}",
                    severity="warning",
                    agenceId=invoice.agenceId,
                    entityId=invoice.id,
                    href="/billing",
                )
            )

    for fuel in scope(store.fuelRecords):
        if fuel.anomalie:
            alerts.append(
                Alert(
                    id=f"alert-fuel-{fuel.id}",
                    type="carburant",
                    message=f"Surconsommation — {fuel.vehicule} ({fuel.conso} L/100km)",
                    severity="info",
                    agenceId=fuel.agenceId,
                    entityId=fuel.id,
                    href="/fuel",
                )
            )

    for vehicle in scope(store.vehicles):
        if vehicle.statut == "immobilise":
            days = _days_since(vehicle.immobiliseDepuis) if vehicle.immobiliseDepuis else 0
            if days >= 3:
                alerts.append(
                    Alert(
                        id=f"alert-immob-{vehicle.id}",
                        type="flotte",
                        message=f"{vehicle.immatriculation} immobilisé depuis {days} jour{'s' if days > 1 else ''} — action requise",
                        severity="danger",
                        agenceId=vehicle.agenceId,
                        entityId=vehicle.id,
                        href="/fleet",
                    )
                )
            else:
                alerts.append(
                    Alert(
                        id=f"alert-veh-{vehicle.id}",
                        type="maintenance",
                        message=f"{vehicle.immatriculation} immobilisé — vérifier disponibilité",
                        severity="warning",
                        agenceId=vehicle.agenceId,
                        entityId=vehicle.id,
                        href="/fleet",
                    )
                )

    rank = {"danger": 0, "warning": 1, "info": 2}
    return sorted(alerts, key=lambda a: rank[a.severity])
