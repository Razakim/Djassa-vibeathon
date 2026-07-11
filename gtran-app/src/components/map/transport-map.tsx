import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker, useMap } from "react-leaflet"
import L from "leaflet"
import type { LatLng } from "@/lib/geo/cities"
import type { Mission } from "@/types/entities"
import type { MissionStatus } from "@/types/shared"
import "leaflet/dist/leaflet.css"
import "./map.css"

export interface MapVehicle {
  id: string
  label: string
  coords: LatLng
  subtitle?: string
  color?: string
  missionId?: string
}

interface TransportMapProps {
  center?: LatLng
  zoom?: number
  height?: string | number
  missions?: Mission[]
  vehicles?: MapVehicle[]
  selectedMissionId?: string | null
  onMissionSelect?: (id: string | null) => void
  showRoutes?: boolean
  showVehicles?: boolean
  showCities?: boolean
  showLegend?: boolean
  statusFilter?: MissionStatus[]
  theme?: "light" | "dark"
  className?: string
}

export const STATUS_COLORS: Record<string, string> = {
  planifiee: "#3b82f6",
  en_cours: "#10b981",
  en_retard: "#ef4444",
  livree: "#8b5cf6",
  annulee: "#9ca3af",
}

const STATUS_LABELS: Record<string, string> = {
  planifiee: "Planifiée",
  en_cours: "En cours",
  en_retard: "En retard",
  livree: "Livrée",
  annulee: "Annulée",
}

const TILES = {
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
}

const TRUCK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`

function createTruckIcon(color: string, selected = false) {
  return L.divIcon({
    html: `<div class="truck-marker${selected ? " truck-marker--selected" : ""}" style="--color: ${color}">${TRUCK_SVG}</div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

function createCityIcon() {
  return L.divIcon({
    html: `<div class="city-marker"></div>`,
    className: "",
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  })
}

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100)
    return () => clearTimeout(t)
  }, [map])
  return null
}

function FlyTo({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 })
  }, [map, center, zoom])
  return null
}

function sliceRoute(route: LatLng[], progress: number): [LatLng[], LatLng[]] {
  if (progress <= 0) return [[], route]
  if (progress >= 1) return [route, []]
  const splitIdx = Math.max(1, Math.floor(progress * (route.length - 1)))
  return [route.slice(0, splitIdx + 1), route.slice(splitIdx)]
}

export function TransportMap({
  center = [7.5, -5.5],
  zoom = 6,
  height = 420,
  missions = [],
  vehicles = [],
  selectedMissionId,
  onMissionSelect,
  showRoutes = true,
  showVehicles = true,
  showCities = false,
  showLegend = true,
  statusFilter,
  theme = "light",
  className = "",
}: TransportMapProps) {
  const filteredMissions = useMemo(
    () => (statusFilter?.length ? missions.filter((m) => statusFilter.includes(m.statut)) : missions),
    [missions, statusFilter]
  )

  const cityMarkers = useMemo(() => {
    if (!showCities) return []
    const seen = new Set<string>()
    const markers: { key: string; name: string; coords: LatLng }[] = []
    for (const m of filteredMissions) {
      for (const [name, coords] of [
        [m.depart, m.route[0]] as const,
        [m.destination, m.route[m.route.length - 1]] as const,
      ]) {
        if (!seen.has(name)) {
          seen.add(name)
          markers.push({ key: name, name, coords })
        }
      }
    }
    return markers
  }, [filteredMissions, showCities])

  const flyTarget = useMemo(() => {
    if (!selectedMissionId) return null
    const mission = missions.find((m) => m.id === selectedMissionId)
    if (!mission?.route?.length) return null
    const mid = mission.route[Math.floor(mission.route.length / 2)]
    return { center: mid, zoom: 8 }
  }, [selectedMissionId, missions])

  const activeStatuses = useMemo(() => {
    const set = new Set(filteredMissions.map((m) => m.statut))
    return Array.from(set)
  }, [filteredMissions])

  return (
    <div className={`gtran-map relative overflow-hidden rounded-lg border ${className}`} style={{ height }}>
      <MapContainer center={center} zoom={zoom} className="size-full" scrollWheelZoom>
        <MapResizer />
        {flyTarget && <FlyTo center={flyTarget.center} zoom={flyTarget.zoom} />}
        <TileLayer attribution='&copy; <a href="https://carto.com/">CARTO</a>' url={TILES[theme]} />

        {showRoutes &&
          filteredMissions.map((mission) => {
            const color = STATUS_COLORS[mission.statut] ?? "#3b82f6"
            const isSelected = mission.id === selectedMissionId
            const [done, remaining] = sliceRoute(mission.route, mission.progress)

            return (
              <span key={mission.id}>
                {remaining.length > 1 && (
                  <Polyline
                    positions={remaining}
                    pathOptions={{
                      color: "#94a3b8",
                      weight: isSelected ? 4 : 2,
                      opacity: isSelected ? 0.6 : 0.35,
                      dashArray: "6 10",
                    }}
                    eventHandlers={{ click: () => onMissionSelect?.(mission.id) }}
                  />
                )}
                {done.length > 1 && (
                  <Polyline
                    positions={done}
                    pathOptions={{
                      color,
                      weight: isSelected ? 6 : 4,
                      opacity: isSelected ? 1 : 0.85,
                    }}
                    eventHandlers={{ click: () => onMissionSelect?.(mission.id) }}
                  >
                    <Popup>
                      <MapPopup mission={mission} />
                    </Popup>
                  </Polyline>
                )}
                {mission.statut === "planifiee" && (
                  <Polyline
                    positions={mission.route}
                    pathOptions={{
                      color,
                      weight: isSelected ? 5 : 3,
                      opacity: isSelected ? 1 : 0.7,
                      dashArray: "8 8",
                    }}
                    eventHandlers={{ click: () => onMissionSelect?.(mission.id) }}
                  >
                    <Popup>
                      <MapPopup mission={mission} />
                    </Popup>
                  </Polyline>
                )}
                <CircleMarker
                  center={mission.route[0]}
                  radius={isSelected ? 7 : 5}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.9, weight: 2 }}
                  eventHandlers={{ click: () => onMissionSelect?.(mission.id) }}
                />
                <CircleMarker
                  center={mission.route[mission.route.length - 1]}
                  radius={isSelected ? 7 : 5}
                  pathOptions={{ color, fillColor: "#fff", fillOpacity: 1, weight: 2 }}
                  eventHandlers={{ click: () => onMissionSelect?.(mission.id) }}
                />
              </span>
            )
          })}

        {showCities &&
          cityMarkers.map((c) => (
            <Marker key={c.key} position={c.coords} icon={createCityIcon()}>
              <Popup>
                <p className="text-sm font-semibold">{c.name}</p>
              </Popup>
            </Marker>
          ))}

        {showVehicles &&
          vehicles.map((v) => {
            const selected = v.missionId === selectedMissionId
            return (
              <Marker
                key={v.id}
                position={v.coords}
                icon={createTruckIcon(v.color ?? STATUS_COLORS.en_cours, selected)}
                eventHandlers={{
                  click: () => v.missionId && onMissionSelect?.(v.missionId),
                }}
              >
                <Popup>
                  <div className="space-y-1 text-sm">
                    <p className="font-bold font-mono">{v.label}</p>
                    {v.subtitle && <p>{v.subtitle}</p>}
                  </div>
                </Popup>
              </Marker>
            )
          })}
      </MapContainer>

      {showLegend && activeStatuses.length > 0 && (
        <div className="map-legend">
          <p className="map-legend__title">Légende</p>
          {activeStatuses.map((s) => (
            <div key={s} className="map-legend__item">
              <span className="map-legend__dot" style={{ background: STATUS_COLORS[s] }} />
              <span>{STATUS_LABELS[s] ?? s}</span>
            </div>
          ))}
          <div className="map-legend__item">
            <span className="map-legend__line map-legend__line--done" />
            <span>Parcouru</span>
          </div>
          <div className="map-legend__item">
            <span className="map-legend__line map-legend__line--remaining" />
            <span>Restant</span>
          </div>
        </div>
      )}
    </div>
  )
}

function MapPopup({ mission }: { mission: Mission }) {
  return (
    <div className="space-y-1 text-sm min-w-[160px]">
      <p className="font-bold">{mission.id}</p>
      <p>
        {mission.depart} → {mission.destination}
      </p>
      <p className="text-muted-foreground">
        {mission.client} — {mission.chauffeur}
      </p>
      <p className="text-xs">
        Progression : {Math.round(mission.progress * 100)}%
      </p>
    </div>
  )
}
