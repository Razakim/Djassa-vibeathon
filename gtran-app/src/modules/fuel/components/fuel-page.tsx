import { AlertTriangle, Fuel } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { fuelRecords } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"

export function FuelPage() {
  const anomalies = fuelRecords.filter((f) => f.anomalie)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion du carburant"
        description="Pleins, consommation, stations et détection d'anomalies"
        action={{ label: "Enregistrer un plein" }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Fuel className="size-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold">8,45 M</p>
              <p className="text-sm text-muted-foreground">Coût ce mois (XOF)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">31,2 L</p>
            <p className="text-sm text-muted-foreground">Consommation moyenne /100km</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertTriangle className="size-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold">{anomalies.length}</p>
              <p className="text-sm text-muted-foreground">Anomalies détectées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Litres</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Conso L/100</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Anomalie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fuelRecords.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-mono">{f.vehicule}</TableCell>
                  <TableCell>{f.station}</TableCell>
                  <TableCell>{f.litres} L</TableCell>
                  <TableCell>{formatCurrency(f.montant)}</TableCell>
                  <TableCell>{f.conso}</TableCell>
                  <TableCell>{formatDate(f.date)}</TableCell>
                  <TableCell>
                    {f.anomalie ? (
                      <Badge variant="warning">+18% surconso</Badge>
                    ) : (
                      <Badge variant="success">Normal</Badge>
                    )}
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
