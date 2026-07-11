import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { drivers } from "@/lib/mock-data"

export function DriversPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des chauffeurs"
        description="Permis, performances, disponibilités et historique"
        action={{ label: "Nouveau chauffeur" }}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Chauffeurs actifs</p>
            <p className="text-2xl font-bold">24</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Disponibles</p>
            <p className="text-2xl font-bold text-emerald-400">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Ponctualité moyenne</p>
            <p className="text-2xl font-bold">91%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Km ce mois</p>
            <p className="text-2xl font-bold">56 100</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chauffeur</TableHead>
                <TableHead>Permis</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Ponctualité</TableHead>
                <TableHead>Km (mois)</TableHead>
                <TableHead>Accidents</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.nom}</TableCell>
                  <TableCell>{d.permis}</TableCell>
                  <TableCell>{d.categorie}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={d.ponctualite} className="w-16 h-2" />
                      <span className="text-sm">{d.ponctualite}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{d.km.toLocaleString("fr-FR")}</TableCell>
                  <TableCell>{d.accidents}</TableCell>
                  <TableCell>
                    <Badge variant={d.statut === "disponible" ? "success" : d.statut === "congé" ? "secondary" : "info"}>
                      {d.statut}
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
