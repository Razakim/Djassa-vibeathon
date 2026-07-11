import {
  AlertTriangle,
  Fuel,
  MapPin,
  Route,
  TrendingDown,
  TrendingUp,
  Truck,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { alerts, dashboardStats, missions, revenueChart } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { MissionStatusBadge } from "@/components/shared/status-badge"

export function DashboardPage() {
  const marge = dashboardStats.revenusMois - dashboardStats.depensesMois

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de votre activité — flotte, missions, finances et alertes"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Véhicules disponibles"
          value={String(dashboardStats.vehiculesDisponibles)}
          icon={Truck}
          description="Sur 42 véhicules actifs"
        />
        <StatCard
          title="Missions en cours"
          value={String(dashboardStats.missionsEnCours)}
          icon={Route}
          trend={{ value: `${dashboardStats.missionsEnRetard} en retard`, positive: false }}
        />
        <StatCard
          title="Revenus du mois"
          value={formatCurrency(dashboardStats.revenusMois)}
          icon={TrendingUp}
          trend={{ value: "+12% vs mois dernier", positive: true }}
        />
        <StatCard
          title="Marge nette"
          value={formatCurrency(marge)}
          icon={TrendingDown}
          description={`Dépenses : ${formatCurrency(dashboardStats.depensesMois)}`}
        />
      </div>

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
                <Tooltip
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-400" />
              Alertes ({alerts.length})
            </CardTitle>
            <CardDescription>Maintenance, documents, paiements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 rounded-lg border p-3">
                <Badge
                  variant={
                    alert.severity === "danger"
                      ? "destructive"
                      : alert.severity === "warning"
                        ? "warning"
                        : "info"
                  }
                  className="shrink-0 mt-0.5"
                >
                  {alert.type}
                </Badge>
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="size-4" />
              Missions récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {missions.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{m.id} — {m.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {m.depart} → {m.destination}
                    </p>
                  </div>
                  <MissionStatusBadge status={m.statut} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="size-4" />
              Indicateurs rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Carburant ce mois</span>
              <span className="font-semibold">{formatCurrency(dashboardStats.carburantMois)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Documents expirant</span>
              <Badge variant="warning">{dashboardStats.documentsExpirant}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Véhicules immobilisés</span>
              <Badge variant="destructive">2</Badge>
            </div>
            <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
              <MapPin className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Carte GPS temps réel</p>
              <p className="text-xs mt-1">12 véhicules suivis en direct</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
