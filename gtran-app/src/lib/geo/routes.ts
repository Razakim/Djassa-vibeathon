import type { LatLng } from "./cities"
import { getCityCoords } from "./cities"

/** Corridors routiers principaux — évite les lignes droites « décoratives » */
const CORRIDORS: Record<string, string[]> = {
  "Abidjan|Bouaké": ["Abidjan", "Yamoussoukro", "Bouaké"],
  "Bouaké|Abidjan": ["Bouaké", "Yamoussoukro", "Abidjan"],
  "Abidjan|Yamoussoukro": ["Abidjan", "Yamoussoukro"],
  "Yamoussoukro|Abidjan": ["Yamoussoukro", "Abidjan"],
  "Abidjan|San Pedro": ["Abidjan", "San Pedro"],
  "San Pedro|Abidjan": ["San Pedro", "Abidjan"],
  "San Pedro|Bouaké": ["San Pedro", "Abidjan", "Yamoussoukro", "Bouaké"],
  "Bouaké|San Pedro": ["Bouaké", "Yamoussoukro", "Abidjan", "San Pedro"],
  "Abidjan|Dakar": ["Abidjan", "Yamoussoukro", "Bouaké", "Bamako", "Dakar"],
  "Dakar|Abidjan": ["Dakar", "Bamako", "Bouaké", "Yamoussoukro", "Abidjan"],
  "Ferkessédougou|Abidjan": ["Ferkessédougou", "Bouaké", "Yamoussoukro", "Abidjan"],
  "Abidjan|Ferkessédougou": ["Abidjan", "Yamoussoukro", "Bouaké", "Ferkessédougou"],
  "Ferkessédougou|Bouaké": ["Ferkessédougou", "Bouaké"],
  "Bouaké|Ferkessédougou": ["Bouaké", "Ferkessédougou"],
  "Bouaké|Dakar": ["Bouaké", "Bamako", "Dakar"],
  "Dakar|Bouaké": ["Dakar", "Bamako", "Bouaké"],
}

function corridorKey(from: string, to: string): string {
  return `${from}|${to}`
}

function resolveWaypoints(from: string, to: string): string[] {
  const direct = CORRIDORS[corridorKey(from, to)]
  if (direct) return direct
  const reverse = CORRIDORS[corridorKey(to, from)]
  if (reverse) return [...reverse].reverse()
  return [from, to]
}

function interpolateSegment(a: LatLng, b: LatLng, steps: number): LatLng[] {
  const points: LatLng[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    points.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return points.slice(0, -1)
}

/** Route géodésique par segments via villes-relais */
export function buildCorridorRoute(from: string, to: string, stepsPerSegment = 12): LatLng[] {
  const waypoints = resolveWaypoints(from, to).map(getCityCoords)
  const route: LatLng[] = []

  for (let i = 0; i < waypoints.length - 1; i++) {
    route.push(...interpolateSegment(waypoints[i], waypoints[i + 1], stepsPerSegment))
  }
  route.push(waypoints[waypoints.length - 1])
  return route
}
