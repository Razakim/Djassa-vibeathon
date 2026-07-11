import { useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useDashboardStats, useMissions, useFuelRecords } from "@/hooks/use-data"
import { formatCurrency } from "@/lib/utils"
import { downloadCSV } from "@/lib/export"
import { computeMissionProfit } from "@/lib/mission-profit"
import { MissionStatusBadge } from "@/components/shared/status-badge"

export function AccountingPage() {
  const stats = useDashboardStats()
  const { data: missions } = useMissions()
  const { data: fuel } = useFuelRecords()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const marge = stats.revenusMois - stats.depensesMois

  const livrees = (missions ?? []).filter((m) => m.statut === "livree")

  const expenses = [
    { categorie: "Carburant", montant: stats.carburantMois },
    { categorie: "Missions (coûts opérationnels)", montant: stats.depensesMois - stats.carburantMois },
  ]

  const handleExport = () => {
    downloadCSV(
      `comptabilite-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Mission", "Client", "Revenu", "Coût", "Marge"],
      livrees.map((m) => [m.id, m.client, m.prix, m.cout, m.prix - m.cout])
    )
    toast.success("Export CSV téléchargé")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Comptabilité" description="Revenus, dépenses, marges — missions livrées du mois">
        <Button variant="outline" onClick={handleExport}>Exporter</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Revenus" value={formatCurrency(stats.revenusMois)} icon={TrendingUp} />
        <StatCard title="Dépenses" value={formatCurrency(stats.depensesMois)} icon={TrendingDown} />
        <StatCard title="Bénéfice net" value={formatCurrency(marge)} icon={Wallet} trend={{ value: `${((marge / stats.revenusMois) * 100 || 0).toFixed(1)}% marge`, positive: marge > 0 }} />
      </div>

      <Card>
        <CardHeader><CardTitle>Bénéfice par mission (détail Cas 6)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {livrees.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune mission livrée ce mois.</p>
          )}
          {livrees.map((m) => {
            const p = computeMissionProfit(m, fuel ?? [])
            const open = expandedId === m.id
            return (
              <div key={m.id} className="rounded-lg border overflow-hidden">
                <button
                  type="button"
                  className="flex w-full justify-between items-center p-3 text-sm hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(open ? null : m.id)}
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="font-mono">{m.id}</span>
                    <span>{m.client}</span>
                    <MissionStatusBadge status={m.statut} />
                  </div>
                  <span className="text-emerald-500 font-medium">+{formatCurrency(p.benefice)}</span>
                </button>
                {open && (
                  <div className="border-t bg-muted/20 px-4 py-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <span className="text-muted-foreground">Prix de vente</span><span>{formatCurrency(p.prix)}</span>
                    <span className="text-muted-foreground">Carburant</span><span>{formatCurrency(p.carburant)}</span>
                    <span className="text-muted-foreground">Péages</span><span>{formatCurrency(p.peages)}</span>
                    <span className="text-muted-foreground">Salaire chauffeur</span><span>{formatCurrency(p.salaire)}</span>
                    <span className="text-muted-foreground">Réparations / divers</span><span>{formatCurrency(p.reparations + p.autres)}</span>
                    <span className="text-muted-foreground font-medium">Bénéfice net</span>
                    <span className="font-medium">{formatCurrency(p.benefice)} ({p.margePct.toFixed(1)}%)</span>
                  </div>
                )}
              </div>
            )
          })}
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
