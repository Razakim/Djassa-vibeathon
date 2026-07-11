import { getCityCoords, getRouteBearing, interpolateRoute } from "@/lib/geo/cities"
import type { AppStore, Mission, TrackingVehicle, Vehicle } from "@/types/entities"

function missionPosition(mission: Mission): [number, number] {
  if (mission.statut === "planifiee") return mission.route[0] ?? getCityCoords(mission.depart)
  if (mission.statut === "livree" || mission.statut === "annulee") {
    return mission.route[mission.route.length - 1] ?? getCityCoords(mission.destination)
  }
  return interpolateRoute(mission.route, mission.progress)
}

function positionLabel(mission: Mission): string {
  if (mission.statut === "planifiee") return `${mission.depart} (dépôt)`
  if (mission.statut === "livree") return `${mission.destination} (livré)`
  const pct = Math.round(mission.progress * 100)
  return `En route — ${pct}%`
}

function trackingStatut(mission: Mission): string {
  if (mission.statut === "planifiee") return "disponible"
  if (mission.statut === "en_retard") return "arret"
  if (mission.progress < 0.1) return "arret"
  return "en_route"
}

function vitesseFor(mission: Mission): number {
  if (mission.statut === "planifiee" || mission.statut === "livree") return 0
  if (mission.statut === "en_retard") return 0
  return 55 + Math.round(mission.progress * 30)
}

function headingFor(mission: Mission): number {
  if (mission.statut === "planifiee" || mission.route.length < 2) return 0
  return getRouteBearing(mission.route, Math.max(mission.progress, 0.01))
}

function vehicleTypeFor(store: AppStore, vehicleId: string): string | undefined {
  return store.vehicles.find((v) => v.id === vehicleId)?.type
}

function fromMission(store: AppStore, mission: Mission): TrackingVehicle {
  const coords = missionPosition(mission)
  return {
    id: `track-${mission.id}`,
    immatriculation: mission.vehicule,
    chauffeur: mission.chauffeur,
    vitesse: vitesseFor(mission),
    position: positionLabel(mission),
    statut: trackingStatut(mission),
    arret: mission.statut === "en_retard" ? "2h30" : mission.progress < 0.1 ? "15 min" : "—",
    coords,
    heading: headingFor(mission),
    vehicleType: vehicleTypeFor(store, mission.vehicleId),
    missionStatut: mission.statut,
    missionId: mission.id,
    vehicleId: mission.vehicleId,
    driverId: mission.driverId,
  }
}

function idleVehicle(v: Vehicle): TrackingVehicle | null {
  if (v.statut === "en_mission") return null
  const coords = v.position ?? getCityCoords("Abidjan")
  return {
    id: `track-idle-${v.id}`,
    immatriculation: v.immatriculation,
    chauffeur: v.chauffeur ?? "—",
    vitesse: 0,
    position: v.statut === "maintenance" ? "Atelier" : v.statut === "immobilise" ? "Immobilisé" : "Garage",
    statut: v.statut === "disponible" ? "disponible" : "arret",
    arret: "—",
    coords,
    heading: 0,
    vehicleType: v.type,
    vehicleId: v.id,
    driverId: v.driverId,
  }
}

export function deriveTracking(store: AppStore, agenceId?: string): TrackingVehicle[] {
  const missions = agenceId ? store.missions.filter((m) => m.agenceId === agenceId) : store.missions
  const vehicles = agenceId ? store.vehicles.filter((v) => v.agenceId === agenceId) : store.vehicles

  const activeMissionVehicleIds = new Set(
    missions
      .filter((m) => m.statut === "en_cours" || m.statut === "en_retard" || m.statut === "planifiee")
      .map((m) => m.vehicleId)
  )

  const fromMissions = missions
    .filter((m) => m.statut !== "annulee" && m.statut !== "livree")
    .map((m) => fromMission(store, m))

  const fromIdle = vehicles
    .filter((v) => !activeMissionVehicleIds.has(v.id) && v.statut !== "en_mission")
    .map(idleVehicle)
    .filter((t): t is TrackingVehicle => t !== null)

  return [...fromMissions, ...fromIdle]
}
