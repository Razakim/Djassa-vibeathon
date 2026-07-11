import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, FileWarning, Fuel, MapPin, Route, TrendingDown, TrendingUp, Truck } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { MissionStatusBadge } from "@/components/shared/status-badge"
import { StaggerItem, StaggerList } from "@/components/shared/animated-page"
import { TransportMap } from "@/components/map/transport-map"
import { trackingToMapVehicle } from "@/components/map/map-vehicle"
import { useAlerts, useDashboardStats, useMissions, useTracking } from "@/hooks/use-data"

const MORNING = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date())

export function DashboardPage() {
  const navigate = useNavigate()
  const stats = useDashboardStats()
  const { data: missions } = useMissions()
  const { data: alerts } = useAlerts()
  const { data: tracking } = useTracking()
  const marge = stats.revenusMois - stats.depensesMois

  const priorityMissions = (missions ?? [])
    .filter((m) => m.statut === "en_retard" || m.statut === "en_cours")
    .slice(0, 4)

  const recentMissions = priorityMissions.length > 0 ? priorityMissions : (missions ?? []).slice(0, 4)

  const mapVehicles = useMemo(() => {
    const missionById = new Map((missions ?? []).map((m) => [m.id, m]))
    return (tracking ?? [])
      .filter((t) => t.missionId)
      .map((t) => trackingToMapVehicle(t, missionById.get(t.missionId!)))
  }, [tracking, missions])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description={`Bonjour — ${MORNING}. Vue opérationnelle de votre agence.`}
        action={{ label: "Nouvelle mission", onClick: () => navigate("/missions?create=1") }}
      />

      <StaggerList className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StaggerItem className="min-w-0">
          <StatCard title="Véhicules disponibles" value={String(stats.vehiculesDisponibles)} icon={Truck} />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <StatCard
            title="Missions en cours"
            value={String(stats.missionsEnCours)}
            icon={Route}
            trend={{ value: `${stats.missionsEnRetard} en retard`, positive: stats.missionsEnRetard === 0 }}
          />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <StatCard
            title="Revenus du mois"
            value={formatCurrency(stats.revenusMois)}
            icon={TrendingUp}
            description={`${stats.missionsLivreesMois} mission${stats.missionsLivreesMois > 1 ? "s" : ""} livrée${stats.missionsLivreesMois > 1 ? "s" : ""}`}
          />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <StatCard
            title="Marge nette"
            value={formatCurrency(marge)}
            icon={TrendingDown}
            trend={{ value: marge >= 0 ? "Positive" : "Négative", positive: marge >= 0 }}
          />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <StatCard
            title="Carburant"
            value={formatCurrency(stats.carburantMois)}
            icon={Fuel}
            description="Ce mois"
          />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <button type="button" className="block h-full w-full min-w-0 text-left" onClick={() => navigate("/documents")}>
            <StatCard
              title="Docs à renouveler"
              value={String(stats.documentsExpirant)}
              icon={FileWarning}
              trend={
                stats.documentsExpirant > 0
                  ? { value: "Action requise", positive: false }
                  : { value: "À jour", positive: true }
              }
            />
          </button>
        </StaggerItem>
      </StaggerList>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenus vs Dépenses</CardTitle>
            <CardDescription>6 derniers mois — données live (missions livrées + carburant)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mois" className="text-xs" />
                <YAxis className="text-xs" unit="M" />
                <Tooltip
                  formatter={(value: number) => [`${value} M XOF`, ""]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenus" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Revenus" />
                <Bar dataKey="depenses" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Dépenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-400" />
              Alertes ({stats.alertes})
            </CardTitle>
            {stats.alertes > 0 && (
              <Button variant="ghost" size="sm" onClick={() => navigate(alerts?.[0]?.href ?? "/maintenance")}>
                Traiter
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3 max-h-[320px] overflow-auto">
            {alerts?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune alerte — tout est sous contrôle.</p>
            )}
            {alerts?.slice(0, 8).map((alert) => (
              <button
                key={alert.id}
                onClick={() => navigate(alert.href ?? "/dashboard")}
                className="flex w-full items-start gap-3 rounded-lg border p-3 text-left hover:bg-muted/50 transition-colors"
              >
                <Badge variant={alert.severity === "danger" ? "destructive" : alert.severity === "warning" ? "warning" : "info"}>
                  {alert.type}
                </Badge>
                <p className="text-sm">{alert.message}</p>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Route className="size-4" />
              {stats.missionsEnRetard > 0 ? "Missions prioritaires" : "Missions récentes"}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/missions")}>
              Voir tout
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMissions.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => navigate(`/tracking?mission=${m.id}`)}
                className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="font-medium">
                    {m.id} — {m.client}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {m.depart} → {m.destination} · {m.vehicule}
                  </p>
                </div>
                <MissionStatusBadge status={m.statut} />
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-4" />
              Carte GPS
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/tracking")}>
              Plein écran
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <TransportMap
              height={240}
              zoom={6}
              missions={(missions ?? []).filter((m) => m.statut !== "livree" && m.statut !== "annulee")}
              vehicles={mapVehicles}
              showLegend={false}
              showControls={false}
              showDetailPanel={false}
              showCities={false}
              onMissionSelect={(id) => id && navigate(`/tracking?mission=${id}`)}
            />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between rounded-md border px-3 py-2">
                <span className="text-muted-foreground">En route</span>
                <span className="font-semibold">{stats.missionsEnCours}</span>
              </div>
              <div className="flex justify-between rounded-md border px-3 py-2">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Fuel className="size-3" />
                  Carburant
                </span>
                <span className="font-semibold">{formatCurrency(stats.carburantMois)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
