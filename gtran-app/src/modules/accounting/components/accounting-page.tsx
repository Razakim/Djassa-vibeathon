import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useDashboardStats, useMissions } from "@/hooks/use-data"
import { formatCurrency } from "@/lib/utils"
import { downloadCSV } from "@/lib/export"

export function AccountingPage() {
  const stats = useDashboardStats()
  const { data: missions } = useMissions()
  const marge = stats.revenusMois - stats.depensesMois

  const expenses = [
    { categorie: "Carburant", montant: stats.carburantMois },
    { categorie: "Missions (coûts)", montant: stats.depensesMois - stats.carburantMois },
  ]

  const handleExport = () => {
    downloadCSV(
      `comptabilite-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Mission", "Client", "Revenu", "Coût", "Marge"],
      (missions ?? []).map((m) => [m.id, m.client, m.prix, m.cout, m.prix - m.cout])
    )
    toast.success("Export CSV téléchargé")
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Comptabilité" description="Revenus, dépenses, marges">
        <Button variant="outline" onClick={handleExport}>Exporter</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Revenus" value={formatCurrency(stats.revenusMois)} icon={TrendingUp} />
        <StatCard title="Dépenses" value={formatCurrency(stats.depensesMois)} icon={TrendingDown} />
        <StatCard title="Bénéfice net" value={formatCurrency(marge)} icon={Wallet} trend={{ value: `${((marge / stats.revenusMois) * 100 || 0).toFixed(1)}% marge`, positive: marge > 0 }} />
      </div>

      <Card>
        <CardHeader><CardTitle>Détail par mission</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {missions?.map((m) => (
            <div key={m.id} className="flex justify-between items-center rounded-lg border p-3 text-sm">
              <span>{m.id} — {m.client}</span>
              <span className="text-emerald-400 font-medium">+{formatCurrency(m.prix - m.cout)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Répartition des dépenses</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {expenses.map((e) => (
            <div key={e.categorie} className="flex items-center justify-between">
              <span>{e.categorie}</span>
              <span className="font-medium">{formatCurrency(e.montant)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
