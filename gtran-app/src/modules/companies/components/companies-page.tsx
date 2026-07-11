import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { agences } from "@/lib/mock-data"

export function CompaniesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des entreprises"
        description="Agences, employés, rôles, permissions et paramètres"
        action={{ label: "Nouvelle agence" }}
      />

      <Tabs defaultValue="agences">
        <TabsList>
          <TabsTrigger value="agences">Agences</TabsTrigger>
          <TabsTrigger value="employes">Employés</TabsTrigger>
          <TabsTrigger value="roles">Rôles & permissions</TabsTrigger>
          <TabsTrigger value="parametres">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="agences" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {agences.map((ag) => (
              <Card key={ag.id}>
                <CardHeader>
                  <CardTitle className="text-base">{ag.nom}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employés</span>
                    <span className="font-medium">{ag.employes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Véhicules</span>
                    <span className="font-medium">{ag.vehicules}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="employes" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Agence</TableHead>
                    <TableHead>Rôle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Amadou Diallo</TableCell>
                    <TableCell>Directeur exploitation</TableCell>
                    <TableCell>Siège Abidjan</TableCell>
                    <TableCell><Badge>Admin</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fatou Bamba</TableCell>
                    <TableCell>Dispatcher</TableCell>
                    <TableCell>Siège Abidjan</TableCell>
                    <TableCell><Badge variant="secondary">Opérations</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Aya Koné</TableCell>
                    <TableCell>Comptable</TableCell>
                    <TableCell>Siège Abidjan</TableCell>
                    <TableCell><Badge variant="secondary">Finance</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              RBAC multi-tenant : chaque rôle est scoped par entreprise et agence. Permissions granulaires par module (flotte, missions, facturation...).
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametres" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between">
                <span>Devise principale</span>
                <Badge>XOF (Franc CFA)</Badge>
              </div>
              <div className="flex justify-between">
                <span>Fuseau horaire</span>
                <Badge variant="secondary">Africa/Abidjan</Badge>
              </div>
              <div className="flex justify-between">
                <span>Multi-agence</span>
                <Badge variant="success">Activé</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
