import { useState } from "react"
import { FileWarning } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useDocuments, useDocumentMutations } from "@/hooks/use-data"
import { formatDate } from "@/lib/utils"
import { downloadCSV } from "@/lib/export"
export function DocumentsPage() {
  const { data: documents } = useDocuments()
  const { create, remove } = useDocumentMutations()
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ type: "Assurance", entite: "", expiration: "" })

  const expiring = documents?.filter((d) => d.statut === "expire_bientot").length ?? 0

  const handleAdd = async () => {
    if (!form.entite || !form.expiration) { toast.error("Champs requis"); return }
    const statut = new Date(form.expiration) < new Date(Date.now() + 30 * 86400000) ? "expire_bientot" : "valide"
    await create.mutateAsync({ ...form, statut })
    toast.success("Document ajouté")
    setOpen(false)
  }

  const handleExport = () => {
    downloadCSV(
      `documents-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Type", "Entité", "Expiration", "Statut"],
      (documents ?? []).map((d) => [d.type, d.entite, d.expiration, d.statut])
    )
    toast.success("Export CSV téléchargé")
  }

  return (    <div className="space-y-6">
      <PageHeader title="Gestion documentaire" description="Assurances, permis, cartes grises, BL..." action={{ label: "Ajouter un document", onClick: () => setOpen(true) }} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6 flex items-center gap-3"><FileWarning className="size-8 text-amber-400" /><div><p className="text-2xl font-bold">{expiring}</p><p className="text-sm text-muted-foreground">Expirent bientôt</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{documents?.length ?? 0}</p><p className="text-sm text-muted-foreground">Documents actifs</p></CardContent></Card>
        <Card><CardContent className="pt-6"><Button variant="outline" className="w-full" onClick={handleExport}>Exporter tout</Button></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Entité</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents?.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.type}</TableCell>
                  <TableCell>{d.entite}</TableCell>
                  <TableCell>{formatDate(d.expiration)}</TableCell>
                  <TableCell><Badge variant={d.statut === "expire_bientot" ? "warning" : "success"}>{d.statut === "expire_bientot" ? "Expire bientôt" : "Valide"}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="sm" onClick={() => setDeleteId(d.id)}>Supprimer</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouveau document</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Type</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
            <div><Label>Entité liée</Label><Input value={form.entite} onChange={(e) => setForm({ ...form, entite: e.target.value })} /></div>
            <div><Label>Date d'expiration</Label><Input type="date" value={form.expiration} onChange={(e) => setForm({ ...form, expiration: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleAdd}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Supprimer ce document ?" variant="destructive" confirmLabel="Supprimer"
        onConfirm={async () => { if (deleteId) { await remove.mutateAsync(deleteId); toast.success("Supprimé"); setDeleteId(null) } }} />
    </div>
  )
}
