import { useMemo, useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { TransportMap } from "@/components/map/transport-map"
import { MissionStatusBadge } from "@/components/shared/status-badge"
import { formatCurrency } from "@/lib/utils"
import { useMissions, useMissionMutations, useDrivers, useVehicles } from "@/hooks/use-data"
import { interpolateRoute } from "@/lib/geo/cities"
import type { MissionStatus } from "@/types/shared"
import { Search, Trash2, Play, CheckCircle } from "lucide-react"

const CITIES = ["Abidjan", "Bouaké", "San Pedro", "Yamoussoukro", "Dakar", "Ferkessédougou"]

export function MissionsPage() {
  const { data: missions, isLoading } = useMissions()
  const { data: drivers } = useDrivers()
  const { data: vehicles } = useVehicles()
  const { create, update, remove } = useMissionMutations()
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({
    client: "", depart: "Abidjan", destination: "Bouaké", marchandise: "", poids: "20 t",
    chauffeur: "", vehicule: "", prix: 1000000, cout: 600000,
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return (missions ?? []).filter(
      (m) => m.id.toLowerCase().includes(q) || m.client.toLowerCase().includes(q) || m.depart.toLowerCase().includes(q)
    )
  }, [missions, search])

  const mapVehicles = useMemo(
    () =>
      (missions ?? [])
        .filter((m) => m.statut === "en_cours" || m.statut === "en_retard")
        .map((m) => ({
          id: m.id,
          label: m.vehicule,
          subtitle: m.chauffeur,
          coords: interpolateRoute(m.route, m.progress),
          missionId: m.id,
        })),
    [missions]
  )

  const handleCreate = async () => {
    if (!form.client || !form.marchandise) {
      toast.error("Remplissez les champs obligatoires")
      return
    }
    if (!form.chauffeur || !form.vehicule) {
      toast.error("Sélectionnez un chauffeur et un véhicule")
      return
    }
    await create.mutateAsync({
      ...form,
      statut: "planifiee",
      chauffeur: form.chauffeur,
    })
    toast.success("Mission créée")
    setDialogOpen(false)
    setForm({ client: "", depart: "Abidjan", destination: "Bouaké", marchandise: "", poids: "20 t", chauffeur: "", vehicule: "", prix: 1000000, cout: 600000 })
  }

  const changeStatus = async (id: string, statut: MissionStatus) => {
    await update.mutateAsync({ id, statut, progress: statut === "livree" ? 1 : statut === "en_cours" ? 0.45 : undefined })
    toast.success(`Statut mis à jour : ${statut}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des missions"
        description="Création, assignation et suivi d'étapes"
        action={{ label: "Nouvelle mission", onClick: () => setDialogOpen(true) }}
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <TransportMap
        height={300}
        missions={missions ?? []}
        vehicles={mapVehicles}
        selectedMissionId={selectedId}
        onMissionSelect={setSelectedId}
      />

      <Card>
        <CardHeader><CardTitle>Missions ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Chargement...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Réf.</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id} className={selectedId === m.id ? "bg-muted/40" : ""} onClick={() => setSelectedId(m.id)}>
                    <TableCell className="font-mono">{m.id}</TableCell>
                    <TableCell>{m.client}</TableCell>
                    <TableCell className="text-sm">{m.depart} → {m.destination}</TableCell>
                    <TableCell>{formatCurrency(m.prix)}</TableCell>
                    <TableCell><MissionStatusBadge status={m.statut} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        {m.statut === "planifiee" && (
                          <Button size="icon" variant="ghost" title="Démarrer" onClick={() => changeStatus(m.id, "en_cours")}>
                            <Play className="size-4" />
                          </Button>
                        )}
                        {(m.statut === "en_cours" || m.statut === "en_retard") && (
                          <Button size="icon" variant="ghost" title="Livrer" onClick={() => changeStatus(m.id, "livree")}>
                            <CheckCircle className="size-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" title="Supprimer" onClick={() => setDeleteId(m.id)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nouvelle mission</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Client</Label><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Départ</Label>
                <Select value={form.depart} onValueChange={(v) => setForm({ ...form, depart: v })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Destination</Label>
                <Select value={form.destination} onValueChange={(v) => setForm({ ...form, destination: v })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Marchandise</Label><Input value={form.marchandise} onChange={(e) => setForm({ ...form, marchandise: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Chauffeur</Label>
                <Select value={form.chauffeur} onValueChange={(v) => setForm({ ...form, chauffeur: v })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    {drivers?.filter((d) => d.statut === "disponible").map((d) => (
                      <SelectItem key={d.id} value={d.nom}>{d.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Véhicule</Label>
                <Select value={form.vehicule} onValueChange={(v) => setForm({ ...form, vehicule: v })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    {vehicles?.filter((v) => v.statut === "disponible").map((v) => (
                      <SelectItem key={v.id} value={v.immatriculation}>{v.immatriculation} — {v.type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Prix (XOF)</Label><Input type="number" value={form.prix} onChange={(e) => setForm({ ...form, prix: +e.target.value })} /></div>
              <div><Label>Coût (XOF)</Label><Input type="number" value={form.cout} onChange={(e) => setForm({ ...form, cout: +e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={create.isPending}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Supprimer la mission ?"
        description="Cette action est irréversible."
        variant="destructive"
        confirmLabel="Supprimer"
        loading={remove.isPending}
        onConfirm={async () => {
          if (deleteId) {
            await remove.mutateAsync(deleteId)
            toast.success("Mission supprimée")
            setDeleteId(null)
          }
        }}
      />
    </div>
  )
}
