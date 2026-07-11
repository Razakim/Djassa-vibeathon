import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import { Crosshair, Maximize2, Navigation } from "lucide-react"
import type { LatLng } from "@/lib/geo/cities"
import {
  getCityMeta,
  getHubCities,
  getRemainingDistanceKm,
  interpolateRoute,
  routeLengthKm,
} from "@/lib/geo/cities"
import {
  estimateEtaMinutes,
  formatCoords,
  formatDistance,
  formatEta,
} from "@/lib/geo/distance"
import type { Mission } from "@/types/entities"
import type { MissionStatus } from "@/types/shared"
import { Button } from "@/components/ui/button"
import { createCityLabelIcon, createEndpointIcon, createProgressDot, createTruckIcon } from "./map-icons"
import "leaflet/dist/leaflet.css"
import "./map.css"

export interface MapVehicle {
  id: string
  label: string
  coords: LatLng
  subtitle?: string
  color?: string
  missionId?: string
  heading?: number
  speed?: number
  driver?: string
  client?: string
  missionRef?: string
  progress?: number
  status?: string
  vehicleType?: string
  positionLabel?: string
  idle?: boolean
}

interface TransportMapProps {
  center?: LatLng
  zoom?: number
  height?: string | number
  missions?: Mission[]
  vehicles?: MapVehicle[]
  selectedMissionId?: string | null
  onMissionSelect?: (id: string | null) => void
  onOpenMission?: (missionId: string) => void
  showRoutes?: boolean
  showVehicles?: boolean
  showCities?: boolean
  showLegend?: boolean
  showControls?: boolean
  showDetailPanel?: boolean
  autoFitOnLoad?: boolean
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
  light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
}

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100)
    return () => clearTimeout(t)
  }, [map])
  return null
}

function FitBoundsOnDemand({
  bounds,
  trigger,
}: {
  bounds: L.LatLngBoundsExpression | null
  trigger: number
}) {
  const map = useMap()
  useEffect(() => {
    if (trigger > 0 && bounds) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 10 })
    }
  }, [map, bounds, trigger])
  return null
}

function FlyToSelection({ target }: { target: { center: LatLng; zoom: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (!target) return
    map.flyTo(target.center, target.zoom, { duration: 0.9 })
  }, [map, target])
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
  onOpenMission,
  showRoutes = true,
  showVehicles = true,
  showCities = false,
  showLegend = true,
  showControls = true,
  showDetailPanel = true,
  autoFitOnLoad = false,
  statusFilter,
  theme = "light",
  className = "",
}: TransportMapProps) {
  const markerRefs = useRef<Record<string, L.Marker>>({})
  const [fitTrigger, setFitTrigger] = useState(autoFitOnLoad ? 1 : 0)

  const filteredMissions = useMemo(
    () => (statusFilter?.length ? missions.filter((m) => statusFilter.includes(m.statut)) : missions),
    [missions, statusFilter]
  )

  const selectedMission = useMemo(
    () => missions.find((m) => m.id === selectedMissionId),
    [missions, selectedMissionId]
  )

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.missionId === selectedMissionId),
    [vehicles, selectedMissionId]
  )

  const cityMarkers = useMemo(() => {
    if (!showCities) return []
    const seen = new Set<string>()
    const markers: { key: string; name: string; countryCode: string; coords: LatLng; hub: boolean }[] = []

    const addCity = (name: string) => {
      if (seen.has(name)) return
      seen.add(name)
      const meta = getCityMeta(name)
      markers.push({
        key: name,
        name: meta.name,
        countryCode: meta.countryCode,
        coords: meta.coords,
        hub: !!meta.hub,
      })
    }

    for (const m of filteredMissions) {
      addCity(m.depart)
      addCity(m.destination)
    }
    if (markers.length < 3) {
      getHubCities().forEach((c) => addCity(c.name))
    }
    return markers
  }, [filteredMissions, showCities])

  const bounds = useMemo(() => {
    const points: LatLng[] = []
    filteredMissions.forEach((m) => points.push(...m.route))
    vehicles.forEach((v) => points.push(v.coords))
    if (points.length === 0) return null
    return L.latLngBounds(points)
  }, [filteredMissions, vehicles])

  const flyTarget = useMemo(() => {
    if (!selectedMissionId) return null
    const mission = missions.find((m) => m.id === selectedMissionId)
    if (!mission?.route?.length) return null
    const pos = selectedVehicle?.coords ?? interpolateRoute(mission.route, mission.progress)
    return { center: pos, zoom: 9 }
  }, [selectedMissionId, missions, selectedVehicle])

  const activeStatuses = useMemo(() => {
    const set = new Set(filteredMissions.map((m) => m.statut))
    return Array.from(set)
  }, [filteredMissions])

  const openSelectedPopup = useCallback(() => {
    if (!selectedMissionId) return
    const key = vehicles.find((v) => v.missionId === selectedMissionId)?.id ?? selectedMissionId
    markerRefs.current[key]?.openPopup()
  }, [selectedMissionId, vehicles])

  useEffect(() => {
    if (selectedMissionId) {
      const t = setTimeout(openSelectedPopup, 400)
      return () => clearTimeout(t)
    }
  }, [selectedMissionId, openSelectedPopup])

  const handleFitAll = useCallback(() => {
    setFitTrigger((n) => n + 1)
  }, [])

  return (
    <div className={`gtran-map relative overflow-hidden rounded-lg border ${className}`} style={{ height }}>
      <MapContainer center={center} zoom={zoom} className="size-full" scrollWheelZoom>
        <MapResizer />
        <FitBoundsOnDemand bounds={bounds} trigger={fitTrigger} />
        {flyTarget && <FlyToSelection target={flyTarget} />}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url={TILES[theme]}
        />

        {showRoutes &&
          filteredMissions.map((mission) => {
            const color = STATUS_COLORS[mission.statut] ?? "#3b82f6"
            const isSelected = mission.id === selectedMissionId
            const [done, remaining] = sliceRoute(mission.route, mission.progress)
            const totalKm = routeLengthKm(mission.route)
            const remainingKm = getRemainingDistanceKm(mission.route, mission.progress)
            const speed = selectedVehicle?.speed ?? (mission.statut === "en_cours" ? 65 : 0)
            const eta = estimateEtaMinutes(remainingKm, speed)

            return (
              <span key={mission.id}>
                {remaining.length > 1 && (
                  <Polyline
                    positions={remaining}
                    pathOptions={{
                      color: "#64748b",
                      weight: isSelected ? 5 : 3,
                      opacity: isSelected ? 0.55 : 0.3,
                      dashArray: "8 12",
                      lineCap: "round",
                    }}
                    eventHandlers={{ click: () => onMissionSelect?.(mission.id) }}
                  />
                )}
                {done.length > 1 && (
                  <Polyline
                    positions={done}
                    pathOptions={{
                      color,
                      weight: isSelected ? 7 : 5,
                      opacity: isSelected ? 1 : 0.88,
                      lineCap: "round",
                    }}
                    eventHandlers={{ click: () => onMissionSelect?.(mission.id) }}
                  />
                )}
                {mission.statut === "planifiee" && (
                  <Polyline
                    positions={mission.route}
                    pathOptions={{
                      color,
                      weight: isSelected ? 6 : 4,
                      opacity: isSelected ? 0.9 : 0.55,
                      dashArray: "10 10",
                      lineCap: "round",
                    }}
                    eventHandlers={{ click: () => onMissionSelect?.(mission.id) }}
                  />
                )}

                <Marker
                  position={mission.route[0]}
                  icon={createEndpointIcon("depart", mission.depart)}
                  eventHandlers={{ click: () => onMissionSelect?.(mission.id) }}
                />
                <Marker
                  position={mission.route[mission.route.length - 1]}
                  icon={createEndpointIcon("arrivee", mission.destination)}
                  eventHandlers={{ click: () => onMissionSelect?.(mission.id) }}
                />

                {mission.statut !== "planifiee" && mission.progress > 0 && mission.progress < 1 && (
                  <Marker
                    position={interpolateRoute(mission.route, mission.progress)}
                    icon={createProgressDot(color)}
                    zIndexOffset={500}
                  />
                )}

                {isSelected && (
                  <Popup position={interpolateRoute(mission.route, Math.max(mission.progress, 0))}>
                    <MissionPopup
                      mission={mission}
                      totalKm={totalKm}
                      remainingKm={remainingKm}
                      eta={eta}
                      onOpen={() => onOpenMission?.(mission.id)}
                    />
                  </Popup>
                )}
              </span>
            )
          })}

        {showCities &&
          cityMarkers.map((c) => (
            <Marker
              key={c.key}
              position={c.coords}
              icon={createCityLabelIcon(c.name, c.countryCode, c.hub ? "hub" : "stop")}
              zIndexOffset={-100}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={0.95} permanent={false}>
                <div className="map-tooltip-city">
                  <strong>{c.name}</strong>
                  <span>{getCityMeta(c.name).country}</span>
                </div>
              </Tooltip>
            </Marker>
          ))}

        {showVehicles &&
          vehicles.map((v) => {
            const selected = v.missionId === selectedMissionId
            const mission = missions.find((m) => m.id === v.missionId)
            return (
              <Marker
                key={v.id}
                position={v.coords}
                icon={createTruckIcon({
                  color: v.color ?? STATUS_COLORS.en_cours,
                  heading: v.heading,
                  selected,
                  speed: v.speed,
                  plate: v.label,
                  status: v.status,
                  vehicleType: v.vehicleType,
                })}
                zIndexOffset={selected ? 1000 : 100}
                ref={(ref) => {
                  if (ref) markerRefs.current[v.id] = ref
                }}
                eventHandlers={{
                  click: () => {
                    if (v.missionId) onMissionSelect?.(v.missionId)
                    else onMissionSelect?.(null)
                  },
                }}
              >
                <Popup minWidth={240} maxWidth={300}>
                  <VehiclePopup vehicle={v} mission={mission} onOpen={onOpenMission} />
                </Popup>
              </Marker>
            )
          })}
      </MapContainer>

      {showControls && (
        <div className="map-controls">
          <Button type="button" size="icon" variant="secondary" className="map-controls__btn" onClick={handleFitAll} title="Voir toute la flotte">
            <Maximize2 className="size-4" />
          </Button>
          {selectedMissionId && flyTarget && (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="map-controls__btn"
              onClick={() => openSelectedPopup()}
              title="Centrer la sélection"
            >
              <Crosshair className="size-4" />
            </Button>
          )}
        </div>
      )}

      {showDetailPanel && selectedMission && (
        <div className="map-detail-panel">
          <div className="map-detail-panel__header">
            <Navigation className="size-4 text-primary" />
            <div>
              <p className="map-detail-panel__title">{selectedMission.id}</p>
              <p className="map-detail-panel__sub">
                {selectedMission.depart} → {selectedMission.destination}
              </p>
            </div>
          </div>
          <div className="map-detail-panel__grid">
            <div>
              <span className="map-detail-panel__label">Client</span>
              <span>{selectedMission.client}</span>
            </div>
            <div>
              <span className="map-detail-panel__label">Camion</span>
              <span className="font-mono">{selectedMission.vehicule}</span>
            </div>
            <div>
              <span className="map-detail-panel__label">Chauffeur</span>
              <span>{selectedMission.chauffeur}</span>
            </div>
            <div>
              <span className="map-detail-panel__label">Progression</span>
              <span>{Math.round(selectedMission.progress * 100)}%</span>
            </div>
            {selectedVehicle && (
              <>
                <div>
                  <span className="map-detail-panel__label">Vitesse</span>
                  <span>{selectedVehicle.speed ?? 0} km/h</span>
                </div>
                <div>
                  <span className="map-detail-panel__label">Position GPS</span>
                  <span className="text-xs">{formatCoords(selectedVehicle.coords)}</span>
                </div>
              </>
            )}
          </div>
          {onOpenMission && (
            <Button size="sm" className="w-full mt-2" onClick={() => onOpenMission(selectedMission.id)}>
              Ouvrir la mission
            </Button>
          )}
        </div>
      )}

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
          <div className="map-legend__item">
            <span className="map-legend__endpoint map-legend__endpoint--depart">D</span>
            <span>Départ</span>
          </div>
          <div className="map-legend__item">
            <span className="map-legend__endpoint map-legend__endpoint--arrivee">A</span>
            <span>Arrivée</span>
          </div>
        </div>
      )}
    </div>
  )
}

function MissionPopup({
  mission,
  totalKm,
  remainingKm,
  eta,
  onOpen,
}: {
  mission: Mission
  totalKm: number
  remainingKm: number
  eta: number | null
  onOpen?: () => void
}) {
  return (
    <div className="map-popup">
      <div className="map-popup__header">
        <span className="map-popup__badge" style={{ background: STATUS_COLORS[mission.statut] }}>
          {STATUS_LABELS[mission.statut]}
        </span>
        <span className="map-popup__id">{mission.id}</span>
      </div>
      <p className="map-popup__route">
        {mission.depart} → {mission.destination}
      </p>
      <p className="map-popup__meta">
        {mission.client} · {mission.chauffeur}
      </p>
      <div className="map-popup__stats">
        <div><span>Distance</span><strong>{formatDistance(totalKm)}</strong></div>
        <div><span>Restant</span><strong>{formatDistance(remainingKm)}</strong></div>
        <div><span>ETA</span><strong>{formatEta(eta)}</strong></div>
        <div><span>Avancement</span><strong>{Math.round(mission.progress * 100)}%</strong></div>
      </div>
      {onOpen && (
        <button type="button" className="map-popup__action" onClick={onOpen}>
          Voir la fiche mission
        </button>
      )}
    </div>
  )
}

function VehiclePopup({
  vehicle,
  mission,
  onOpen,
}: {
  vehicle: MapVehicle
  mission?: Mission
  onOpen?: (id: string) => void
}) {
  const remainingKm = mission ? getRemainingDistanceKm(mission.route, mission.progress) : 0
  const eta = estimateEtaMinutes(remainingKm, vehicle.speed ?? 0)

  return (
    <div className="map-popup">
      <div className="map-popup__header">
        <span
          className="map-popup__badge"
          style={{ background: vehicle.color ?? STATUS_COLORS.en_cours }}
        >
          {vehicle.idle ? "Au dépôt" : STATUS_LABELS[vehicle.status ?? ""] ?? "En service"}
        </span>
        <span className="map-popup__id font-mono">{vehicle.label}</span>
      </div>
      {vehicle.vehicleType && <p className="map-popup__type">{vehicle.vehicleType}</p>}
      <p className="map-popup__meta">
        {vehicle.driver ?? "—"}
        {vehicle.client ? ` · ${vehicle.client}` : ""}
      </p>
      {vehicle.positionLabel && <p className="map-popup__route">{vehicle.positionLabel}</p>}
      <div className="map-popup__stats">
        <div><span>Vitesse</span><strong>{vehicle.speed ?? 0} km/h</strong></div>
        <div><span>GPS</span><strong className="text-xs">{formatCoords(vehicle.coords)}</strong></div>
        {mission && (
          <>
            <div><span>Restant</span><strong>{formatDistance(remainingKm)}</strong></div>
            <div><span>ETA</span><strong>{formatEta(eta)}</strong></div>
          </>
        )}
      </div>
      {vehicle.missionId && onOpen && (
        <button type="button" className="map-popup__action" onClick={() => onOpen(vehicle.missionId!)}>
          Suivre la mission {vehicle.missionRef}
        </button>
      )}
    </div>
  )
}
