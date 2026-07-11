import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { StaggerItem, StaggerList } from "@/components/shared/animated-page"
import { VehicleStatusBadge } from "@/components/shared/status-badge"
import { useVehicles, useVehicleMutations } from "@/hooks/use-data"
import type { VehicleStatus } from "@/types/shared"

const TYPES = ["Semi-remorque", "Camion plateau", "Camion frigorifique", "Porte-conteneur", "Utilitaire"]
const STATUTS: VehicleStatus[] = ["disponible", "en_mission", "maintenance", "immobilise"]

export function FleetPage() {
  const { data: vehicles } = useVehicles()
  const { create, update, remove } = useVehicleMutations()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ immatriculation: "", type: TYPES[0], statut: "disponible" as VehicleStatus, km: 0, conso: 30 })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return (vehicles ?? []).filter(
      (v) => v.immatriculation.toLowerCase().includes(q) || v.type.toLowerCase().includes(q) || (v.chauffeur ?? "").toLowerCase().includes(q)
    )
  }, [vehicles, search])

  const openCreate = () => {
    setEditId(null)
    setForm({ immatriculation: "", type: TYPES[0], statut: "disponible", km: 0, conso: 30 })
    setDialogOpen(true)
  }

  const openEdit = (v: NonNullable<typeof vehicles>[0]) => {
    setEditId(v.id)
    setForm({ immatriculation: v.immatriculation, type: v.type, statut: v.statut, km: v.km, conso: v.conso })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.immatriculation) { toast.error("Immatriculation requise"); return }
    if (editId) {
      await update.mutateAsync({ id: editId, ...form, chauffeur: null, disponibilite: form.statut === "disponible" ? 100 : 0 })
      toast.success("Véhicule mis à jour")
    } else {
      await create.mutateAsync({ ...form, chauffeur: null, disponibilite: 100 })
      toast.success("Véhicule ajouté")
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gestion de flotte" description="Camions, remorques, utilitaires — état et disponibilité" action={{ label: "Ajouter un véhicule", onClick: openCreate }} />

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input placeholder="Rechercher par immatriculation..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <StaggerList className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((v) => (
          <StaggerItem key={v.id}>
            <Card className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => openEdit(v)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-mono">{v.immatriculation}</CardTitle>
                <VehicleStatusBadge status={v.statut} />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">{v.type}</div>
                {v.chauffeur && <div className="text-sm">Chauffeur : <span className="text-foreground">{v.chauffeur}</span></div>}
                <div className="text-sm">Km : <span className="font-medium">{v.km.toLocaleString("fr-FR")}</span></div>
                {v.statut === "disponible" && (
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span>Disponibilité</span><span>{v.disponibilite}%</span></div>
                    <Progress value={v.disponibilite} />
                  </div>
                )}
                <Button variant="ghost" size="sm" className="text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteId(v.id) }}>
                  Supprimer
                </Button>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerList>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Modifier" : "Ajouter"} un véhicule</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Immatriculation</Label><Input value={form.immatriculation} onChange={(e) => setForm({ ...form, immatriculation: e.target.value })} /></div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as VehicleStatus })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Kilométrage</Label><Input type="number" value={form.km} onChange={(e) => setForm({ ...form, km: +e.target.value })} /></div>
              <div><Label>Conso L/100</Label><Input type="number" value={form.conso} onChange={(e) => setForm({ ...form, conso: +e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editId ? "Enregistrer" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Supprimer ce véhicule ?"
        variant="destructive"
        confirmLabel="Supprimer"
        onConfirm={async () => {
          if (deleteId) { await remove.mutateAsync(deleteId); toast.success("Véhicule supprimé"); setDeleteId(null) }
        }}
      />
    </div>
  )
}
