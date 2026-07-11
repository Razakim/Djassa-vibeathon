import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { employees } from "@/lib/mock-data"

export function HrPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion RH"
        description="Contrats, congés, absences, primes, sanctions et paie"
        action={{ label: "Nouvel employé" }}
      />

      <Tabs defaultValue="employes">
        <TabsList>
          <TabsTrigger value="employes">Employés</TabsTrigger>
          <TabsTrigger value="conges">Congés</TabsTrigger>
          <TabsTrigger value="paie">Paie</TabsTrigger>
          <TabsTrigger value="sanctions">Sanctions</TabsTrigger>
        </TabsList>

        <TabsContent value="employes" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Contrat</TableHead>
                    <TableHead>Congés restants</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.nom}</TableCell>
                      <TableCell>{e.poste}</TableCell>
                      <TableCell><Badge variant="secondary">{e.contrat}</Badge></TableCell>
                      <TableCell>{e.conges} jours</TableCell>
                      <TableCell>
                        <Badge variant={e.statut === "actif" ? "success" : "warning"}>{e.statut}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conges" className="mt-4">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Fatou Bamba — congé du 08/07 au 22/07. Koné Ibrahim — 3 jours demandés en attente de validation.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paie" className="mt-4">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Masse salariale juillet : 12 300 000 XOF. Prochaine paie : 31/07/2026.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sanctions" className="mt-4">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Aucune sanction active ce mois-ci.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
