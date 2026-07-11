from __future__ import annotations

from app.schemas import FuelRecord, Mission


def compute_mission_profit(mission: Mission, fuel_records: list[FuelRecord]) -> dict:
    vehicle_fuel = sum(f.montant for f in fuel_records if f.vehicleId == mission.vehicleId)
    carburant = min(vehicle_fuel, mission.cout * 0.5) if vehicle_fuel > 0 else round(mission.cout * 0.36)
    peages = round(mission.cout * 0.12)
    salaire = round(mission.cout * 0.28)
    reparations = round(mission.cout * 0.08)
    autres = max(0, mission.cout - carburant - peages - salaire - reparations)
    benefice = mission.prix - mission.cout

    return {
        "prix": mission.prix,
        "carburant": carburant,
        "peages": peages,
        "salaire": salaire,
        "reparations": reparations,
        "autres": autres,
        "coutTotal": mission.cout,
        "benefice": benefice,
        "margePct": (benefice / mission.prix * 100) if mission.prix > 0 else 0,
    }


def format_mission_profit_text(mission: Mission, breakdown: dict) -> str:
    fmt = lambda n: f"{int(n):,}".replace(",", " ")
    return "\n".join(
        [
            f"Mission {mission.id} ({mission.client}, {mission.depart} → {mission.destination}) :",
            f"• Prix de vente : {fmt(breakdown['prix'])} XOF",
            f"• Carburant : {fmt(breakdown['carburant'])} XOF",
            f"• Péages : {fmt(breakdown['peages'])} XOF",
            f"• Salaire chauffeur : {fmt(breakdown['salaire'])} XOF",
            f"• Réparations / divers : {fmt(breakdown['reparations'] + breakdown['autres'])} XOF",
            f"• Coût total : {fmt(breakdown['coutTotal'])} XOF",
            f"• Bénéfice net : {fmt(breakdown['benefice'])} XOF ({breakdown['margePct']:.1f}% de marge)",
        ]
    )
