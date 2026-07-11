import { useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAgences, useEmployees } from "@/hooks/use-data"
import { useEmployeeMutations } from "@/hooks/use-data"

const ROLES = [
  { nom: "Administrateur", permissions: "Accès complet, gestion entreprise", scope: "Toutes agences" },
  { nom: "Opérations", permissions: "Missions, flotte, chauffeurs, GPS", scope: "Agence active" },
  { nom: "Finance", permissions: "Facturation, paiements, comptabilité", scope: "Agence active" },
  { nom: "Chauffeur", permissions: "Missions assignées, messagerie", scope: "Personnel" },
]

export function CompaniesPage() {
  const { data: agences } = useAgences()
  const { data: employees } = useEmployees()
  const { create } = useEmployeeMutations()
  const [agenceDialog, setAgenceDialog] = useState(false)
  const [nom, setNom] = useState("")

  const handleAddEmployee = async () => {
    if (!nom) return
    await create.mutateAsync({ nom, poste: "Employé", contrat: "CDI", conges: 25, statut: "actif" })
    toast.success("Employé ajouté")
    setNom("")
    setAgenceDialog(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gestion des entreprises" description="Agences, employés, rôles et paramètres" action={{ label: "Nouvel employé", onClick: () => setAgenceDialog(true) }} />

      <Tabs defaultValue="agences">
        <TabsList>
          <TabsTrigger value="agences">Agences</TabsTrigger>
          <TabsTrigger value="employes">Employés</TabsTrigger>
          <TabsTrigger value="roles">Rôles</TabsTrigger>
          <TabsTrigger value="parametres">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="agences" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {agences?.map((ag) => (
              <Card key={ag.id} className="hover:border-primary/30 transition-colors">
                <CardHeader><CardTitle className="text-base">{ag.nom}</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Ville</span><span>{ag.ville}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Employés</span><span className="font-medium">{ag.employes}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Véhicules</span><span className="font-medium">{ag.vehicules}</span></div>
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
                    <TableHead>Contrat</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees?.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.nom}</TableCell>
                      <TableCell>{e.poste}</TableCell>
                      <TableCell><Badge variant="secondary">{e.contrat}</Badge></TableCell>
                      <TableCell><Badge variant={e.statut === "actif" ? "success" : "warning"}>{e.statut}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Scope</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROLES.map((r) => (
                    <TableRow key={r.nom}>
                      <TableCell className="font-medium">{r.nom}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.permissions}</TableCell>
                      <TableCell><Badge variant="secondary">{r.scope}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametres" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between"><span>Devise</span><Badge>XOF</Badge></div>
              <div className="flex justify-between"><span>Fuseau</span><Badge variant="secondary">Africa/Abidjan</Badge></div>
              <Button variant="outline" onClick={() => toast.success("Paramètres enregistrés")}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={agenceDialog} onOpenChange={setAgenceDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouvel employé</DialogTitle></DialogHeader>
          <div><Label>Nom</Label><Input value={nom} onChange={(e) => setNom(e.target.value)} /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAgenceDialog(false)}>Annuler</Button>
            <Button onClick={handleAddEmployee}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
