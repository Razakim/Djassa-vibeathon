import { useNavigate } from "react-router-dom"
import { AlertTriangle, Fuel, MapPin, Route, TrendingDown, TrendingUp, Truck } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { revenueChart } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { MissionStatusBadge } from "@/components/shared/status-badge"
import { StaggerItem, StaggerList } from "@/components/shared/animated-page"
import { TransportMap } from "@/components/map/transport-map"
import { useAlerts, useDashboardStats, useMissions, useTracking } from "@/hooks/use-data"

export function DashboardPage() {
  const navigate = useNavigate()
  const stats = useDashboardStats()
  const { data: missions } = useMissions()
  const { data: alerts } = useAlerts()
  const { data: tracking } = useTracking()
  const marge = stats.revenusMois - stats.depensesMois

  const mapVehicles = (tracking ?? []).map((t) => ({
    id: t.id,
    label: t.immatriculation,
    subtitle: `${t.chauffeur} — ${t.vitesse} km/h`,
    coords: t.coords,
    missionId: t.missionId,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de votre activité — flotte, missions, finances et alertes"
        action={{ label: "Nouvelle mission", onClick: () => navigate("/missions") }}
      />

      <StaggerList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem><StatCard title="Véhicules disponibles" value={String(stats.vehiculesDisponibles)} icon={Truck} /></StaggerItem>
        <StaggerItem>
          <StatCard
            title="Missions en cours"
            value={String(stats.missionsEnCours)}
            icon={Route}
            trend={{ value: `${stats.missionsEnRetard} en retard`, positive: false }}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard title="Revenus du mois" value={formatCurrency(stats.revenusMois)} icon={TrendingUp} trend={{ value: "Données live", positive: true }} />
        </StaggerItem>
        <StaggerItem>
          <StatCard title="Marge nette" value={formatCurrency(marge)} icon={TrendingDown} description={`Dépenses : ${formatCurrency(stats.depensesMois)}`} />
        </StaggerItem>
      </StaggerList>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenus vs Dépenses</CardTitle>
            <CardDescription>Évolution sur 6 mois (millions XOF)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mois" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="revenus" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Revenus" />
                <Bar dataKey="depenses" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Dépenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-400" />
              Alertes ({alerts?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[320px] overflow-auto">
            {alerts?.map((alert) => (
              <button
                key={alert.id}
                onClick={() => navigate(alert.type === "mission" ? "/missions" : alert.type === "paiement" ? "/billing" : "/maintenance")}
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
            <CardTitle className="flex items-center gap-2"><Route className="size-4" />Missions récentes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/missions")}>Voir tout</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {missions?.slice(0, 4).map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium">{m.id} — {m.client}</p>
                  <p className="text-sm text-muted-foreground">{m.depart} → {m.destination}</p>
                </div>
                <MissionStatusBadge status={m.statut} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><MapPin className="size-4" />Carte GPS</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/tracking")}>Plein écran</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <TransportMap
              height={220}
              zoom={6}
              missions={missions?.filter((m) => m.statut !== "livree") ?? []}
              vehicles={mapVehicles}
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1"><Fuel className="size-3" />Carburant</span>
              <span className="font-semibold">{formatCurrency(stats.carburantMois)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
