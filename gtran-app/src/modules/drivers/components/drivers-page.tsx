import { useState } from "react"
import { User, Pencil, Trash2, AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react"
import { toast } from "sonner"
import { motion } from "motion/react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useDrivers, useDriverMutations } from "@/hooks/use-data"

const STATUS_CONFIG = {
  disponible: { label: "Disponible", color: "bg-emerald-500", variant: "success" as const },
  "en mission": { label: "En mission", color: "bg-ivory-orange", variant: "info" as const },
  congé: { label: "En congé", color: "bg-zinc-400", variant: "secondary" as const },
  malade: { label: "Malade", color: "bg-red-500", variant: "destructive" as const },
}

export function DriversPage() {
  const { data: drivers } = useDrivers()
  const { create, update, remove } = useDriverMutations()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ nom: "", permis: "C", categorie: "National" })

  const total = drivers?.length ?? 0
  const disponibles = drivers?.filter((d) => d.statut === "disponible").length ?? 0
  const ponctualiteMoy = total
    ? Math.round(drivers!.reduce((s, d) => s + d.ponctualite, 0) / total)
    : 0
  const kmTotal = drivers?.reduce((s, d) => s + d.km, 0) ?? 0

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
    if (!form.nom) {
      toast.error("Le nom est requis")
      return
    }
    if (editId) {
      await update.mutateAsync({ id: editId, ...form })
      toast.success(`${form.nom} mis à jour`)
    } else {
      await create.mutateAsync({ ...form, ponctualite: 90, km: 0, accidents: 0, statut: "disponible" })
      toast.success(`${form.nom} ajouté — disponible`)
    }
    setOpen(false)
  }

  const stats = [
    {
      icon: Users,
      label: "Chauffeurs",
      value: total,
      sub: "enregistrés",
      color: "text-ivory-emerald",
      bg: "bg-ivory-emerald/10",
    },
    {
      icon: CheckCircle2,
      label: "Disponibles",
      value: disponibles,
      sub: "prêts à mission",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: Clock,
      label: "Ponctualité",
      value: `${ponctualiteMoy}%`,
      sub: "moyenne équipe",
      color: "text-ivory-orange",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: AlertTriangle,
      label: "Km totaux",
      value: kmTotal.toLocaleString("fr-FR"),
      sub: "cumulés",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des chauffeurs"
        description="Permis, performances, disponibilités"
        action={{ label: "Nouveau chauffeur", onClick: openCreate }}
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Card className="rounded-3xl border-zinc-100 dark:border-zinc-800 hover:border-ivory-emerald/30 transition-colors">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`flex size-11 items-center justify-center rounded-2xl ${s.bg} shrink-0`}>
                  <s.icon className={`size-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-inter font-black tracking-tight">{s.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70">{s.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Drivers table */}
      <Card className="rounded-3xl border-zinc-100 dark:border-zinc-800">
        <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <User className="size-3.5" />
            Registre des chauffeurs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-6">
                  Chauffeur
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Permis
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Catégorie
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Ponctualité
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Km
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Statut
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers?.map((d, i) => {
                const status = STATUS_CONFIG[d.statut as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.disponible
                return (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-xl bg-ivory-orange/10 text-ivory-orange font-black text-xs shrink-0">
                          {d.nom.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm">{d.nom}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-bold text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                        {d.permis}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.categorie}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress
                          value={d.ponctualite}
                          className="w-16 h-1.5 rounded-full [&>div]:bg-ivory-emerald"
                        />
                        <span className="text-xs font-bold">{d.ponctualite}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {d.km.toLocaleString("fr-FR")} km
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={status.variant}
                        className="text-[9px] font-black uppercase tracking-widest rounded-full gap-1.5"
                      >
                        <span className={`size-1.5 rounded-full ${status.color} inline-block`} />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          onClick={() => openEdit(d)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-destructive"
                          onClick={() => setDeleteId(d.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight">
              {editId ? "Modifier le chauffeur" : "Nouveau chauffeur"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest">Nom complet</Label>
              <Input
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="Ex. Konan Brice"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest">Type de permis</Label>
              <Input
                value={form.permis}
                onChange={(e) => setForm({ ...form, permis: e.target.value })}
                placeholder="C, D, EC..."
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest">Catégorie</Label>
              <Input
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                placeholder="National, International..."
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-2xl" onClick={() => setOpen(false)}>
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

      {/* Confirm delete */}
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
