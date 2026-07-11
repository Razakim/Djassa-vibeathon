import { buildCorridorRoute } from "./routes"
import { getBearing, haversineKm, routeLengthKm } from "./distance"

export type LatLng = [number, number]

export interface CityMeta {
  name: string
  country: string
  countryCode: string
  coords: LatLng
  hub?: boolean
}

/** Coordonnées WGS84 précises — hubs logistiques Afrique de l'Ouest */
export const CITY_REGISTRY: Record<string, CityMeta> = {
  Abidjan: {
    name: "Abidjan",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coords: [5.348, -4.0275],
    hub: true,
  },
  Bouaké: {
    name: "Bouaké",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coords: [7.6939, -5.0303],
    hub: true,
  },
  "San Pedro": {
    name: "San Pedro",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coords: [4.7485, -6.6363],
    hub: true,
  },
  Yamoussoukro: {
    name: "Yamoussoukro",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coords: [6.82, -5.2775],
    hub: true,
  },
  Ferkessédougou: {
    name: "Ferkessédougou",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coords: [9.5928, -5.1963],
  },
  Bamako: {
    name: "Bamako",
    country: "Mali",
    countryCode: "ML",
    coords: [12.6392, -8.0029],
    hub: true,
  },
  Dakar: {
    name: "Dakar",
    country: "Sénégal",
    countryCode: "SN",
    coords: [14.6928, -17.4467],
    hub: true,
  },
}

/** @deprecated Utiliser CITY_REGISTRY */
export const CITIES: Record<string, LatLng> = Object.fromEntries(
  Object.entries(CITY_REGISTRY).map(([k, v]) => [k, v.coords])
)

export function getCityMeta(city: string): CityMeta {
  return CITY_REGISTRY[city] ?? CITY_REGISTRY.Abidjan
}

export function getCityCoords(city: string): LatLng {
  return getCityMeta(city).coords
}

export function getHubCities(): CityMeta[] {
  return Object.values(CITY_REGISTRY).filter((c) => c.hub)
}

export function buildRoute(from: string, to: string, steps = 12): LatLng[] {
  return buildCorridorRoute(from, to, steps)
}

export function interpolateRoute(route: LatLng[], progress: number): LatLng {
  if (route.length === 0) return getCityCoords("Abidjan")
  if (route.length === 1) return route[0]
  const idx = Math.min(Math.floor(progress * (route.length - 1)), route.length - 2)
  const t = progress * (route.length - 1) - idx
  const a = route[idx]
  const b = route[idx + 1]
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

export function getRouteBearing(route: LatLng[], progress: number): number {
  if (route.length < 2) return 0
  const idx = Math.min(Math.floor(progress * (route.length - 1)), route.length - 2)
  return getBearing(route[idx], route[idx + 1])
}

export function getRemainingDistanceKm(route: LatLng[], progress: number): number {
  const pos = interpolateRoute(route, progress)
  const idx = Math.min(Math.floor(progress * (route.length - 1)), route.length - 2)
  let remaining = haversineKm(pos, route[idx + 1])
  for (let i = idx + 1; i < route.length - 1; i++) {
    remaining += haversineKm(route[i], route[i + 1])
  }
  return remaining
}

export { routeLengthKm, getBearing, haversineKm }
