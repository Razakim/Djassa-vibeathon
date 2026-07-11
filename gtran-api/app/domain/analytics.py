from __future__ import annotations

from datetime import datetime

from app.schemas import AppStore, FuelRecord, Mission

MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"]


def _filter_agence(items, agence_id: str | None):
    if not agence_id:
        return items
    return [i for i in items if i.agenceId == agence_id]


def _month_key(date: datetime) -> str:
    return f"{date.year}-{date.month:02d}"


def _is_in_month(iso_date: str | None, key: str) -> bool:
    if not iso_date:
        return key == _month_key(datetime.utcnow())
    return iso_date[:7] == key


def _rankings(missions: list[Mission], key_fn) -> list[dict]:
    totals: dict[str, float] = {}
    for mission in missions:
        label = key_fn(mission)
        totals[label] = totals.get(label, 0) + (mission.prix - mission.cout)
    return sorted(
        [{"nom": nom, "marge": marge} for nom, marge in totals.items()],
        key=lambda x: x["marge"],
        reverse=True,
    )[:5]


def compute_analytics(store: AppStore, agence_id: str | None = None) -> dict:
    missions = _filter_agence(store.missions, agence_id)
    return {
        "byVehicle": _rankings(missions, lambda m: m.vehicule),
        "byDriver": _rankings(missions, lambda m: m.chauffeur),
        "byClient": _rankings(missions, lambda m: m.client),
        "byLine": _rankings(missions, lambda m: f"{m.depart} → {m.destination}"),
    }


def build_revenue_chart(missions: list[Mission], fuel: list[FuelRecord]) -> list[dict]:
    now = datetime.utcnow()
    chart: list[dict] = []

    for i in range(5, -1, -1):
        month = now.month - i
        year = now.year
        while month <= 0:
            month += 12
            year -= 1
        d = datetime(year, month, 1)
        key = _month_key(d)
        livrees = [m for m in missions if m.statut == "livree" and _is_in_month(m.createdAt, key)]
        revenus = sum(m.prix for m in livrees) / 1_000_000
        cout_missions = sum(m.cout for m in livrees)
        cout_carburant = sum(f.montant for f in fuel if _is_in_month(f.date, key))
        depenses = (cout_missions + cout_carburant) / 1_000_000
        chart.append(
            {
                "mois": MONTHS_FR[d.month - 1],
                "revenus": round(revenus * 10) / 10,
                "depenses": round(depenses * 10) / 10,
            }
        )

    return chart


def compute_dashboard_stats(store: AppStore, agence_id: str | None = None) -> dict:
    missions = _filter_agence(store.missions, agence_id)
    vehicles = _filter_agence(store.vehicles, agence_id)
    fuel = _filter_agence(store.fuelRecords, agence_id)
    documents = _filter_agence(store.documents, agence_id)

    key = _month_key(datetime.utcnow())
    livrees = [m for m in missions if m.statut == "livree" and _is_in_month(m.createdAt, key)]
    fuel_month = sum(f.montant for f in fuel if _is_in_month(f.date, key))
    revenus = sum(m.prix for m in livrees)
    depenses = sum(m.cout for m in livrees) + fuel_month

    expiring = 0
    for doc in documents:
        days = (datetime.strptime(doc.expiration[:10], "%Y-%m-%d") - datetime.utcnow()).days
        if 0 <= days <= 30:
            expiring += 1

    from app.domain.alerts_engine import compute_alerts

    return {
        "vehiculesDisponibles": len([v for v in vehicles if v.statut == "disponible"]),
        "missionsEnCours": len([m for m in missions if m.statut in ("en_cours", "en_retard")]),
        "missionsEnRetard": len([m for m in missions if m.statut == "en_retard"]),
        "revenusMois": revenus,
        "depensesMois": depenses,
        "carburantMois": fuel_month,
        "alertes": len(compute_alerts(store, agence_id)),
        "documentsExpirant": expiring,
        "missionsLivreesMois": len(livrees),
        "revenueChart": build_revenue_chart(missions, fuel),
    }
