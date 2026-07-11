import { FileWarning } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { documents } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"

export function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion documentaire"
        description="Assurances, permis, cartes grises, lettres de voiture, BL..."
        action={{ label: "Ajouter un document" }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <FileWarning className="size-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Expirent sous 30 jours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">142</p>
            <p className="text-sm text-muted-foreground">Documents actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">Preuves de livraison ce mois</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Entité liée</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.type}</TableCell>
                  <TableCell>{d.entite}</TableCell>
                  <TableCell>{formatDate(d.expiration)}</TableCell>
                  <TableCell>
                    <Badge variant={d.statut === "expire_bientot" ? "warning" : "success"}>
                      {d.statut === "expire_bientot" ? "Expire bientôt" : "Valide"}
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
