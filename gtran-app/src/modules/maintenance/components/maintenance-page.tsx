import { Wrench } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { maintenanceItems } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"

export function MaintenancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance"
        description="Planification vidanges, pneus, révisions et alertes automatiques"
        action={{ label: "Planifier une intervention" }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Wrench className="size-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Interventions à venir</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-red-400">1</p>
            <p className="text-sm text-muted-foreground">Priorité critique</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm text-muted-foreground">Véhicules en atelier</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Km restant</TableHead>
                <TableHead>Priorité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceItems.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono">{m.vehicule}</TableCell>
                  <TableCell>{m.type}</TableCell>
                  <TableCell>{formatDate(m.echeance)}</TableCell>
                  <TableCell>{m.kmRestant > 0 ? `${m.kmRestant} km` : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={m.priorite === "critique" ? "destructive" : m.priorite === "haute" ? "warning" : "secondary"}>
                      {m.priorite}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
