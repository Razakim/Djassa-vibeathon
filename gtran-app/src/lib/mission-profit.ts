import type { FuelRecord, Mission } from "@/types/entities"

export interface MissionProfitBreakdown {
  prix: number
  carburant: number
  peages: number
  salaire: number
  reparations: number
  autres: number
  coutTotal: number
  benefice: number
  margePct: number
}

export function computeMissionProfit(mission: Mission, fuelRecords: FuelRecord[]): MissionProfitBreakdown {
  const vehicleFuel = fuelRecords
    .filter((f) => f.vehicleId === mission.vehicleId)
    .reduce((s, f) => s + f.montant, 0)

  const carburant = vehicleFuel > 0 ? Math.min(vehicleFuel, mission.cout * 0.5) : Math.round(mission.cout * 0.36)
  const peages = Math.round(mission.cout * 0.12)
  const salaire = Math.round(mission.cout * 0.28)
  const reparations = Math.round(mission.cout * 0.08)
  const autres = Math.max(0, mission.cout - carburant - peages - salaire - reparations)
  const benefice = mission.prix - mission.cout

  return {
    prix: mission.prix,
    carburant,
    peages,
    salaire,
    reparations,
    autres,
    coutTotal: mission.cout,
    benefice,
    margePct: mission.prix > 0 ? (benefice / mission.prix) * 100 : 0,
  }
}

export function formatMissionProfitText(mission: Mission, breakdown: MissionProfitBreakdown): string {
  const fmt = (n: number) => n.toLocaleString("fr-FR")
  return [
    `Mission ${mission.id} (${mission.client}, ${mission.depart} → ${mission.destination}) :`,
    `• Prix de vente : ${fmt(breakdown.prix)} XOF`,
    `• Carburant : ${fmt(breakdown.carburant)} XOF`,
    `• Péages : ${fmt(breakdown.peages)} XOF`,
    `• Salaire chauffeur : ${fmt(breakdown.salaire)} XOF`,
    `• Réparations / divers : ${fmt(breakdown.reparations + breakdown.autres)} XOF`,
    `• Coût total : ${fmt(breakdown.coutTotal)} XOF`,
    `• Bénéfice net : ${fmt(breakdown.benefice)} XOF (${breakdown.margePct.toFixed(1)}% de marge)`,
  ].join("\n")
}
