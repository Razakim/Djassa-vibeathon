import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analytics } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"

function RankingList({ items, label }: { items: { nom: string; marge: number }[]; label: string }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.nom} className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
              {i + 1}
            </span>
            <span className="font-medium">{item.nom}</span>
          </div>
          <span className="text-sm font-semibold text-emerald-400">{formatCurrency(item.marge)}</span>
        </div>
      ))}
      <p className="text-xs text-muted-foreground text-center">{label} — marge sur 6 mois</p>
    </div>
  )
}

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analyse financière"
        description="Rentabilité par camion, chauffeur, client et ligne"
      />

      <Tabs defaultValue="vehicules">
        <TabsList>
          <TabsTrigger value="vehicules">Véhicules</TabsTrigger>
          <TabsTrigger value="chauffeurs">Chauffeurs</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="lignes">Lignes</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicules" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Camions les plus rentables</CardTitle>
            </CardHeader>
            <CardContent>
              <RankingList items={analytics.topVehicules} label="Véhicules" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chauffeurs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Chauffeurs les plus rentables</CardTitle>
            </CardHeader>
            <CardContent>
              <RankingList items={analytics.topChauffeurs} label="Chauffeurs" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clients les plus rentables</CardTitle>
            </CardHeader>
            <CardContent>
              <RankingList items={analytics.topClients} label="Clients" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lignes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lignes les plus rentables</CardTitle>
            </CardHeader>
            <CardContent>
              <RankingList items={analytics.topLignes} label="Lignes" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
