import { useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEmployees, useEmployeeMutations } from "@/hooks/use-data"
import { downloadCSV } from "@/lib/export"

export function HrPage() {
  const { data: employees } = useEmployees()
  const { create, update } = useEmployeeMutations()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nom: "", poste: "", contrat: "CDI" })

  const onLeave = employees?.filter((e) => e.statut === "congé").length ?? 0
  const payroll = (employees?.length ?? 0) * 450000

  const handleAdd = async () => {
    if (!form.nom) return
    await create.mutateAsync({ ...form, conges: 25, statut: "actif" })
    toast.success("Employé ajouté")
    setOpen(false)
  }

  const requestLeave = async (id: string, nom: string) => {
    await update.mutateAsync({ id, statut: "congé" })
    toast.success(`Congé enregistré pour ${nom}`)
  }

  const approveLeave = async (id: string, nom: string) => {
    await update.mutateAsync({ id, statut: "actif", conges: Math.max(0, (employees?.find((e) => e.id === id)?.conges ?? 25) - 5) })
    toast.success(`Congé approuvé pour ${nom}`)
  }

  const handlePayroll = () => {
    downloadCSV(
      `paie-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Nom", "Poste", "Contrat", "Statut", "Salaire estimé (XOF)"],
      (employees ?? []).map((e) => [e.nom, e.poste, e.contrat, e.statut, 450000])
    )
    toast.success("Bulletins de paie générés (CSV)")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gestion RH" description="Contrats, congés, paie et sanctions" action={{ label: "Nouvel employé", onClick: () => setOpen(true) }} />

      <Tabs defaultValue="employes">
        <TabsList>
          <TabsTrigger value="employes">Employés ({employees?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="conges">Congés ({onLeave})</TabsTrigger>
          <TabsTrigger value="paie">Paie</TabsTrigger>
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
                    <TableHead>Congés</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees?.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.nom}</TableCell>
                      <TableCell>{e.poste}</TableCell>
                      <TableCell><Badge variant="secondary">{e.contrat}</Badge></TableCell>
                      <TableCell>{e.conges} j</TableCell>
                      <TableCell><Badge variant={e.statut === "actif" ? "success" : "warning"}>{e.statut}</Badge></TableCell>
                      <TableCell>
                        {e.statut === "actif" && (
                          <Button size="sm" variant="ghost" onClick={() => requestLeave(e.id, e.nom)}>Congé</Button>
                        )}
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
            <CardContent className="pt-6 space-y-3">
              {employees?.filter((e) => e.statut === "congé").length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune demande en attente</p>
              ) : (
                employees?.filter((e) => e.statut === "congé").map((e) => (
                  <div key={e.id} className="rounded-lg border p-3 flex justify-between">
                    <span>{e.nom} — {e.poste}</span>
                    <Button size="sm" onClick={() => approveLeave(e.id, e.nom)}>Approuver</Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paie" className="mt-4">
          <Card>
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">{payroll.toLocaleString("fr-FR")} XOF</p>
                <p className="text-sm text-muted-foreground">Masse salariale — {employees?.length ?? 0} employés</p>
              </div>
              <Button onClick={handlePayroll}>Lancer la paie</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouvel employé</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Nom</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
            <div><Label>Poste</Label><Input value={form.poste} onChange={(e) => setForm({ ...form, poste: e.target.value })} /></div>
            <div><Label>Contrat</Label><Input value={form.contrat} onChange={(e) => setForm({ ...form, contrat: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleAdd}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
