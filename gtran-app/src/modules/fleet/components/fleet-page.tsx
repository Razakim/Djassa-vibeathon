import { useMemo, useState } from "react"
import { Search, Truck, Fuel, Wrench, XCircle, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { StaggerItem, StaggerList } from "@/components/shared/animated-page"
import { VehicleStatusBadge } from "@/components/shared/status-badge"
import { useVehicles, useVehicleMutations } from "@/hooks/use-data"
import type { VehicleStatus } from "@/types/shared"
import { cn } from "@/lib/utils"

const TYPES = ["Semi-remorque", "Camion plateau", "Camion frigorifique", "Porte-conteneur", "Utilitaire"]
const STATUTS: VehicleStatus[] = ["disponible", "en_mission", "maintenance", "immobilise"]

const STATUS_ICON: Record<VehicleStatus, typeof Truck> = {
  disponible: Truck,
  en_mission: Fuel,
  maintenance: Wrench,
  immobilise: XCircle,
}

const STATUS_COLORS: Record<VehicleStatus, string> = {
  disponible: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-800/60",
  en_mission: "bg-orange-50 dark:bg-orange-900/10 border-orange-200/60 dark:border-orange-800/60",
  maintenance: "bg-amber-50 dark:bg-amber-900/10 border-amber-200/60 dark:border-amber-800/60",
  immobilise: "bg-red-50 dark:bg-red-900/10 border-red-200/60 dark:border-red-800/60",
}

const STATUS_ICON_COLORS: Record<VehicleStatus, string> = {
  disponible: "bg-emerald-500/10 text-emerald-600",
  en_mission: "bg-ivory-orange/10 text-ivory-orange",
  maintenance: "bg-amber-500/10 text-amber-500",
  immobilise: "bg-red-500/10 text-red-500",
}

export function FleetPage() {
  const { data: vehicles } = useVehicles()
  const { create, update, remove } = useVehicleMutations()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({
    immatriculation: "",
    type: TYPES[0],
    statut: "disponible" as VehicleStatus,
    km: 0,
    conso: 30,
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return (vehicles ?? []).filter(
      (v) =>
        v.immatriculation.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        (v.chauffeur ?? "").toLowerCase().includes(q)
    )
  }, [vehicles, search])

  // Fleet summary stats
  const stats = {
    total: vehicles?.length ?? 0,
    disponibles: vehicles?.filter((v) => v.statut === "disponible").length ?? 0,
    en_mission: vehicles?.filter((v) => v.statut === "en_mission").length ?? 0,
    maintenance: vehicles?.filter((v) => v.statut === "maintenance").length ?? 0,
  }

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
    if (!form.immatriculation) {
      toast.error("L'immatriculation est requise")
      return
    }
    if (editId) {
      await update.mutateAsync({
        id: editId,
        ...form,
        chauffeur: null,
        driverId: null,
        disponibilite: form.statut === "disponible" ? 100 : 0,
      })
      toast.success(`${form.immatriculation} mis à jour`)
    } else {
      await create.mutateAsync({ ...form, chauffeur: null, driverId: null, disponibilite: 100 })
      toast.success(`${form.immatriculation} ajouté à la flotte`)
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion de flotte"
        description="Camions, remorques, utilitaires — état et disponibilité"
        action={{ label: "Ajouter un véhicule", onClick: openCreate }}
      />

      {/* Fleet KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total flotte", value: stats.total, color: "text-zinc-900 dark:text-white" },
          { label: "Disponibles", value: stats.disponibles, color: "text-emerald-600" },
          { label: "En mission", value: stats.en_mission, color: "text-ivory-orange" },
          { label: "Maintenance", value: stats.maintenance, color: "text-amber-500" },
        ].map((s) => (
          <Card key={s.label} className="rounded-3xl border-zinc-100 dark:border-zinc-800">
            <CardContent className="p-5">
              <p className={cn("text-3xl font-inter font-black", s.color)}>{s.value}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">
                {s.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher par immatriculation, type..."
          className="w-full h-10 pl-10 pr-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ivory-emerald/30 focus:border-ivory-emerald transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Vehicle cards */}
      <StaggerList className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {filtered.map((v) => {
            const StatusIcon = STATUS_ICON[v.statut] ?? Truck
            return (
              <StaggerItem key={v.id}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  <Card
                    className={cn(
                      "cursor-pointer border rounded-3xl transition-all hover:shadow-lg hover:shadow-black/5",
                      STATUS_COLORS[v.statut]
                    )}
                    onClick={() => openEdit(v)}
                  >
                    <CardHeader className="flex flex-row items-start justify-between pb-3 gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("flex size-10 items-center justify-center rounded-2xl shrink-0", STATUS_ICON_COLORS[v.statut])}>
                          <StatusIcon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="font-mono font-black text-base tracking-wider truncate">
                            {v.immatriculation}
                          </CardTitle>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate mt-0.5">
                            {v.type}
                          </p>
                        </div>
                      </div>
                      <VehicleStatusBadge status={v.statut} />
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      {v.chauffeur && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="size-5 rounded-lg bg-ivory-orange/15 text-ivory-orange flex items-center justify-center font-black text-[9px]">
                            {v.chauffeur.charAt(0)}
                          </div>
                          <span className="font-medium">{v.chauffeur}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-medium">Kilométrage</span>
                        <span className="font-mono font-bold">{v.km.toLocaleString("fr-FR")} km</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-medium">Conso.</span>
                        <span className="font-mono font-bold">{v.conso} L/100km</span>
                      </div>

                      {v.statut === "disponible" && (
                        <div>
                          <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-widest text-muted-foreground">
                            <span>Disponibilité</span>
                            <span>{v.disponibilite}%</span>
                          </div>
                          <Progress
                            value={v.disponibilite}
                            className="h-1.5 rounded-full [&>div]:bg-emerald-500"
                          />
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-red-50 hover:text-destructive dark:hover:bg-red-900/20 w-full rounded-xl mt-1 text-xs font-bold uppercase tracking-widest"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteId(v.id)
                        }}
                      >
                        <Trash2 className="size-3.5 mr-1.5" />
                        Supprimer
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            )
          })}
        </AnimatePresence>
      </StaggerList>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <Truck className="size-10 opacity-20" />
          <p className="text-sm font-bold uppercase tracking-widest opacity-40">Aucun véhicule trouvé</p>
          <Button variant="outline" className="rounded-2xl mt-2" onClick={openCreate}>
            <Plus className="size-4 mr-2" />
            Ajouter un véhicule
          </Button>
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight">
              {editId ? "Modifier le véhicule" : "Nouveau véhicule"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest">Immatriculation</Label>
              <Input
                value={form.immatriculation}
                onChange={(e) => setForm({ ...form, immatriculation: e.target.value.toUpperCase() })}
                placeholder="Ex. AB-1234-CI"
                className="rounded-xl font-mono font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest">Type de véhicule</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest">Statut</Label>
              <Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as VehicleStatus })}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest">Kilométrage</Label>
                <Input
                  type="number"
                  value={form.km}
                  onChange={(e) => setForm({ ...form, km: +e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest">Conso L/100</Label>
                <Input
                  type="number"
                  value={form.conso}
                  onChange={(e) => setForm({ ...form, conso: +e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-2xl" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="rounded-2xl bg-ivory-emerald hover:bg-ivory-emerald/90 text-white font-black uppercase tracking-widest text-xs"
              onClick={handleSave}
            >
              {editId ? "Enregistrer" : "Ajouter"}
            </Button>
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
          if (deleteId) {
            await remove.mutateAsync(deleteId)
            toast.success("Véhicule supprimé de la flotte")
            setDeleteId(null)
          }
        }}
      />
    </div>
  )
}
