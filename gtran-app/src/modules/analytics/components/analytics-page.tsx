import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useMissions } from "@/hooks/use-data"
import { formatCurrency } from "@/lib/utils"
import { downloadCSV } from "@/lib/export"
function RankingList({ items, label }: { items: { nom: string; marge: number }[]; label: string }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.nom} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">{i + 1}</span>
            <span className="font-medium">{item.nom}</span>
          </div>
          <span className="text-sm font-semibold text-emerald-400">{formatCurrency(item.marge)}</span>
        </div>
      ))}
      <p className="text-xs text-muted-foreground text-center">{label}</p>
    </div>
  )
}

export function AnalyticsPage() {
  const { data: missions } = useMissions()

  const byVehicle = Object.entries(
    (missions ?? []).reduce<Record<string, number>>((acc, m) => {
      acc[m.vehicule] = (acc[m.vehicule] ?? 0) + (m.prix - m.cout)
      return acc
    }, {})
  )
    .map(([nom, marge]) => ({ nom, marge }))
    .sort((a, b) => b.marge - a.marge)
    .slice(0, 5)

  const byClient = Object.entries(
    (missions ?? []).reduce<Record<string, number>>((acc, m) => {
      acc[m.client] = (acc[m.client] ?? 0) + (m.prix - m.cout)
      return acc
    }, {})
  )
    .map(([nom, marge]) => ({ nom, marge }))
    .sort((a, b) => b.marge - a.marge)
    .slice(0, 5)

  const byDriver = Object.entries(
    (missions ?? []).reduce<Record<string, number>>((acc, m) => {
      acc[m.chauffeur] = (acc[m.chauffeur] ?? 0) + (m.prix - m.cout)
      return acc
    }, {})
  )
    .map(([nom, marge]) => ({ nom, marge }))
    .sort((a, b) => b.marge - a.marge)
    .slice(0, 5)

  const byLine = Object.entries(
    (missions ?? []).reduce<Record<string, number>>((acc, m) => {
      const line = `${m.depart} → ${m.destination}`
      acc[line] = (acc[line] ?? 0) + (m.prix - m.cout)
      return acc
    }, {})
  )
    .map(([nom, marge]) => ({ nom, marge }))
    .sort((a, b) => b.marge - a.marge)
    .slice(0, 5)

  const handleExport = () => {
    const rows = [
      ...byVehicle.map((v) => ["Véhicule", v.nom, v.marge]),
      ...byDriver.map((d) => ["Chauffeur", d.nom, d.marge]),
      ...byClient.map((c) => ["Client", c.nom, c.marge]),
      ...byLine.map((l) => ["Ligne", l.nom, l.marge]),
    ]
    downloadCSV(`analytics-${new Date().toISOString().slice(0, 10)}.csv`, ["Catégorie", "Nom", "Marge (XOF)"], rows)
    toast.success("Rapport exporté en CSV")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Analyse financière" description="Rentabilité calculée en temps réel depuis les missions">
        <Button variant="outline" onClick={handleExport}>Exporter CSV</Button>
      </PageHeader>
      <Tabs defaultValue="vehicules">
        <TabsList>
          <TabsTrigger value="vehicules">Véhicules</TabsTrigger>
          <TabsTrigger value="chauffeurs">Chauffeurs</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="lignes">Lignes</TabsTrigger>
        </TabsList>

        {[
          { key: "vehicules", data: byVehicle, title: "Camions les plus rentables" },
          { key: "chauffeurs", data: byDriver, title: "Chauffeurs les plus rentables" },
          { key: "clients", data: byClient, title: "Clients les plus rentables" },
          { key: "lignes", data: byLine, title: "Lignes les plus rentables" },
        ].map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-4">
            <Card>
              <CardHeader><CardTitle>{tab.title}</CardTitle></CardHeader>
              <CardContent><RankingList items={tab.data} label={tab.title} /></CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
