import type { LatLng } from "./cities"

const EARTH_RADIUS_KM = 6_371

export function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const lat1 = toRad(a[0])
  const lat2 = toRad(b[0])
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export function routeLengthKm(route: LatLng[]): number {
  let total = 0
  for (let i = 1; i < route.length; i++) {
    total += haversineKm(route[i - 1], route[i])
  }
  return total
}

/** Cap en degrés (0 = nord, 90 = est) */
export function getBearing(from: LatLng, to: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI
  const lat1 = toRad(from[0])
  const lat2 = toRad(to[0])
  const dLng = toRad(to[1] - from[1])
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

export function formatCoords(coords: LatLng): string {
  const latDir = coords[0] >= 0 ? "N" : "S"
  const lngDir = coords[1] >= 0 ? "E" : "O"
  return `${Math.abs(coords[0]).toFixed(4)}°${latDir}, ${Math.abs(coords[1]).toFixed(4)}°${lngDir}`
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${Math.round(km)} km`
}

export function estimateEtaMinutes(remainingKm: number, speedKmh: number): number | null {
  if (speedKmh <= 0 || remainingKm <= 0) return null
  return Math.round((remainingKm / speedKmh) * 60)
}

export function formatEta(minutes: number | null): string {
  if (minutes === null) return "—"
  if (minutes < 60) return `~${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `~${h}h${m.toString().padStart(2, "0")}` : `~${h}h`
}
