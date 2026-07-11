import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useDrivers, useDriverMutations } from "@/hooks/use-data"

export function DriversPage() {
  const { data: drivers } = useDrivers()
  const { create, update, remove } = useDriverMutations()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ nom: "", permis: "C", categorie: "National" })

  const disponibles = drivers?.filter((d) => d.statut === "disponible").length ?? 0
  const ponctualiteMoy = drivers?.length ? Math.round(drivers.reduce((s, d) => s + d.ponctualite, 0) / drivers.length) : 0

  const openCreate = () => {
    setEditId(null)
    setForm({ nom: "", permis: "C", categorie: "National" })
    setOpen(true)
  }

  const openEdit = (d: NonNullable<typeof drivers>[number]) => {
    setEditId(d.id)
    setForm({ nom: d.nom, permis: d.permis, categorie: d.categorie })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.nom) { toast.error("Nom requis"); return }
    if (editId) {
      await update.mutateAsync({ id: editId, ...form })
      toast.success("Chauffeur mis à jour")
    } else {
      await create.mutateAsync({ ...form, ponctualite: 90, km: 0, accidents: 0, statut: "disponible" })
      toast.success("Chauffeur ajouté")
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gestion des chauffeurs" description="Permis, performances, disponibilités" action={{ label: "Nouveau chauffeur", onClick: openCreate }} />

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Actifs</p><p className="text-2xl font-bold">{drivers?.length ?? 0}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Disponibles</p><p className="text-2xl font-bold text-emerald-600">{disponibles}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Ponctualité moy.</p><p className="text-2xl font-bold">{ponctualiteMoy}%</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Km total</p><p className="text-2xl font-bold">{(drivers?.reduce((s, d) => s + d.km, 0) ?? 0).toLocaleString("fr-FR")}</p></CardContent></Card>
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
                <TableHead>Km</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers?.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.nom}</TableCell>
                  <TableCell>{d.permis}</TableCell>
                  <TableCell>{d.categorie}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><Progress value={d.ponctualite} className="w-16 h-2" /><span className="text-sm">{d.ponctualite}%</span></div></TableCell>
                  <TableCell>{d.km.toLocaleString("fr-FR")}</TableCell>
                  <TableCell><Badge variant={d.statut === "disponible" ? "success" : d.statut === "congé" ? "secondary" : "info"}>{d.statut}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(d)}><Pencil className="size-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setDeleteId(d.id)}><Trash2 className="size-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Modifier le chauffeur" : "Nouveau chauffeur"}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Nom</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
            <div><Label>Permis</Label><Input value={form.permis} onChange={(e) => setForm({ ...form, permis: e.target.value })} /></div>
            <div><Label>Catégorie</Label><Input value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editId ? "Enregistrer" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Supprimer ce chauffeur ?"
        variant="destructive"
        confirmLabel="Supprimer"
        onConfirm={async () => {
          if (deleteId) {
            await remove.mutateAsync(deleteId)
            toast.success("Chauffeur supprimé")
            setDeleteId(null)
          }
        }}
      />
    </div>
  )
}
