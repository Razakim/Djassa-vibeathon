import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { missions } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { MissionStatusBadge } from "@/components/shared/status-badge"

export function MissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des missions"
        description="Création, assignation et suivi d'étapes"
        action={{ label: "Nouvelle mission" }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Missions actives</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Réf.</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Chauffeur</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missions.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono">{m.id}</TableCell>
                    <TableCell>{m.client}</TableCell>
                    <TableCell className="text-sm">{m.depart} → {m.destination}</TableCell>
                    <TableCell>{m.chauffeur}</TableCell>
                    <TableCell>{formatCurrency(m.prix)}</TableCell>
                    <TableCell><MissionStatusBadge status={m.statut} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Créer une mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Input placeholder="Nom du client" />
            </div>
            <div className="space-y-2">
              <Label>Départ</Label>
              <Input placeholder="Ville de départ" />
            </div>
            <div className="space-y-2">
              <Label>Destination</Label>
              <Input placeholder="Ville d'arrivée" />
            </div>
            <div className="space-y-2">
              <Label>Marchandise</Label>
              <Input placeholder="Type de marchandise" />
            </div>
            <div className="space-y-2">
              <Label>Chauffeur</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Assigner automatiquement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Assignation automatique</SelectItem>
                  <SelectItem value="d1">Kouassi Jean</SelectItem>
                  <SelectItem value="d3">Koné Ibrahim</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
