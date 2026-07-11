export type LatLng = [number, number]

export const CITIES: Record<string, LatLng> = {
  Abidjan: [5.36, -4.0083],
  Bouaké: [7.69, -5.03],
  "San Pedro": [4.7485, -6.6363],
  Yamoussoukro: [6.8276, -5.2893],
  Dakar: [14.7167, -17.4677],
  Ferkessédougou: [9.5833, -5.2],
}

export function getCityCoords(city: string): LatLng {
  return CITIES[city] ?? CITIES.Abidjan
}

export function buildRoute(from: string, to: string, steps = 24): LatLng[] {
  const start = getCityCoords(from)
  const end = getCityCoords(to)
  const points: LatLng[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const lat = start[0] + (end[0] - start[0]) * t + Math.sin(t * Math.PI) * 0.15
    const lng = start[1] + (end[1] - start[1]) * t + Math.cos(t * Math.PI * 2) * 0.08
    points.push([lat, lng])
  }

  return points
}

export function interpolateRoute(route: LatLng[], progress: number): LatLng {
  const idx = Math.min(Math.floor(progress * (route.length - 1)), route.length - 2)
  const t = progress * (route.length - 1) - idx
  const a = route[idx]
  const b = route[idx + 1]
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}
