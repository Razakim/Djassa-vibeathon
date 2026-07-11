import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Navigation, MapPin, Route } from "lucide-react"
import { motion } from "motion/react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TransportMap, STATUS_COLORS } from "@/components/map/transport-map"
import { useMissions, useTracking } from "@/hooks/use-data"
import { interpolateRoute } from "@/lib/geo/cities"
import type { MissionStatus } from "@/types/shared"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS: { value: MissionStatus; label: string }[] = [
  { value: "planifiee", label: "Planifiées" },
  { value: "en_cours", label: "En cours" },
  { value: "en_retard", label: "En retard" },
  { value: "livree", label: "Livrées" },
]

export function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: missions } = useMissions()
  const { data: tracking } = useTracking()
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null)
  const [showRoutes, setShowRoutes] = useState(true)
  const [showCities, setShowCities] = useState(true)
  const [statusFilter, setStatusFilter] = useState<MissionStatus[]>(["planifiee", "en_cours", "en_retard"])

  useEffect(() => {
    const missionParam = searchParams.get("mission")
    if (missionParam) {
      setSelectedMissionId(missionParam)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const activeMissions = useMemo(
    () => (missions ?? []).filter((m) => statusFilter.includes(m.statut)),
    [missions, statusFilter]
  )

  const mapVehicles = useMemo(
    () =>
      (tracking ?? []).map((t) => ({
        id: t.id,
        label: t.immatriculation,
        subtitle: `${t.chauffeur} — ${t.position}`,
        coords: t.coords,
        color: t.statut === "en_route" ? STATUS_COLORS.en_cours : t.statut === "arret" ? "#f59e0b" : STATUS_COLORS.planifiee,
        missionId: t.missionId,
      })),
    [tracking]
  )

  const toggleStatus = (s: MissionStatus) => {
    setStatusFilter((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Suivi GPS temps réel" description="Position des camions, chauffeurs et lignes de trajet">
        <div className="flex flex-wrap gap-2">
          <Button variant={showRoutes ? "default" : "outline"} size="sm" onClick={() => setShowRoutes((v) => !v)}>
            <Route className="size-3.5 mr-1" />
            {showRoutes ? "Masquer trajets" : "Afficher trajets"}
          </Button>
          <Button variant={showCities ? "default" : "outline"} size="sm" onClick={() => setShowCities((v) => !v)}>
            <MapPin className="size-3.5 mr-1" />
            Villes
          </Button>
        </div>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <motion.button
            key={opt.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleStatus(opt.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              statusFilter.includes(opt.value)
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <span className="size-2 rounded-full" style={{ background: STATUS_COLORS[opt.value] }} />
            {opt.label}
          </motion.button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <TransportMap
            height={480}
            zoom={6}
            missions={activeMissions}
            vehicles={mapVehicles}
            selectedMissionId={selectedMissionId}
            onMissionSelect={setSelectedMissionId}
            showRoutes={showRoutes}
            showCities={showCities}
            statusFilter={statusFilter}
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="size-4" />
              Flotte en direct ({tracking?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[480px] overflow-auto">
            {tracking?.map((v) => (
              <motion.button
                key={v.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => v.missionId && setSelectedMissionId(v.missionId)}
                className={cn(
                  "w-full rounded-lg border p-3 space-y-1 text-left transition-colors",
                  v.missionId === selectedMissionId ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium">{v.immatriculation}</span>
                  <Badge variant={v.statut === "en_route" ? "success" : v.statut === "arret" ? "warning" : "info"}>
                    {v.vitesse} km/h
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{v.chauffeur}</p>
                <p className="text-sm">{v.position}</p>
                <p className="text-xs text-muted-foreground">Arrêt : {v.arret}</p>
              </motion.button>
            ))}
          </CardContent>
        </Card>
      </div>

      {selectedMissionId && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="pt-4 flex flex-wrap gap-4 text-sm">
              {(() => {
                const m = missions?.find((x) => x.id === selectedMissionId)
                if (!m) return null
                const pos = interpolateRoute(m.route, m.progress)
                return (
                  <>
                    <span><strong>Mission :</strong> {m.id}</span>
                    <span><strong>Trajet :</strong> {m.depart} → {m.destination}</span>
                    <span><strong>Progression :</strong> {Math.round(m.progress * 100)}%</span>
                    <span><strong>Position :</strong> {pos[0].toFixed(4)}, {pos[1].toFixed(4)}</span>
                    <span><strong>Chauffeur :</strong> {m.chauffeur}</span>
                    <span><strong>Véhicule :</strong> {m.vehicule}</span>
                  </>
                )
              })()}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
