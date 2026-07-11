import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { dashboardStats } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"

const expenses = [
  { categorie: "Carburant", montant: 8_450_000 },
  { categorie: "Salaires", montant: 12_300_000 },
  { categorie: "Péages", montant: 1_200_000 },
  { categorie: "Réparations", montant: 4_800_000 },
  { categorie: "Commissions", montant: 2_450_000 },
  { categorie: "Autres", montant: 2_000_000 },
]

export function AccountingPage() {
  const marge = dashboardStats.revenusMois - dashboardStats.depensesMois

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comptabilité"
        description="Revenus, dépenses, marges et suivi financier"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Revenus" value={formatCurrency(dashboardStats.revenusMois)} icon={TrendingUp} />
        <StatCard title="Dépenses" value={formatCurrency(dashboardStats.depensesMois)} icon={TrendingDown} />
        <StatCard title="Bénéfice net" value={formatCurrency(marge)} icon={Wallet} trend={{ value: `${((marge / dashboardStats.revenusMois) * 100).toFixed(1)}% de marge`, positive: true }} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Répartition des dépenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {expenses.map((e) => (
            <div key={e.categorie} className="flex items-center justify-between">
              <span>{e.categorie}</span>
              <div className="flex items-center gap-4">
                <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(e.montant / dashboardStats.depensesMois) * 100}%` }}
                  />
                </div>
                <span className="font-medium w-28 text-right">{formatCurrency(e.montant)}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
