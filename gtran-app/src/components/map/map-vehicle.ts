import type { TrackingVehicle, Mission } from "@/types/entities"
import type { MapVehicle } from "./transport-map"
import { STATUS_COLORS } from "./transport-map"
import { interpolateRoute } from "@/lib/geo/cities"

export function trackingToMapVehicle(t: TrackingVehicle, mission?: Mission): MapVehicle {
  const statut = mission?.statut ?? t.missionStatut
  let color = STATUS_COLORS.planifiee
  if (t.statut === "en_route") color = STATUS_COLORS.en_cours
  if (t.statut === "arret") color = STATUS_COLORS.en_retard
  if (statut) color = STATUS_COLORS[statut] ?? color

  return {
    id: t.id,
    label: t.immatriculation,
    coords: t.coords,
    subtitle: t.position,
    color,
    missionId: t.missionId,
    heading: t.heading,
    speed: t.vitesse,
    driver: t.chauffeur,
    client: mission?.client,
    missionRef: mission?.id ?? t.missionId,
    progress: mission?.progress,
    status: statut ?? (t.statut === "en_route" ? "en_cours" : t.statut === "arret" ? "en_retard" : "planifiee"),
    vehicleType: t.vehicleType,
    positionLabel: t.position,
    idle: !t.missionId,
  }
}

export function missionToMapVehicle(m: Mission, heading?: number, speed?: number): MapVehicle {
  const coords = interpolateRoute(m.route, m.progress)
  return {
    id: m.id,
    label: m.vehicule,
    coords,
    subtitle: m.chauffeur,
    color: STATUS_COLORS[m.statut] ?? STATUS_COLORS.en_cours,
    missionId: m.id,
    heading,
    speed,
    driver: m.chauffeur,
    client: m.client,
    missionRef: m.id,
    progress: m.progress,
    status: m.statut,
    positionLabel: `${m.depart} → ${m.destination}`,
  }
}
