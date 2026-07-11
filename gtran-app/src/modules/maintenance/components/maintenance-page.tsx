import { useState } from "react"
import { Wrench, AlertTriangle, Download, CheckCircle2, Clock } from "lucide-react"
import { toast } from "sonner"
import { motion } from "motion/react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMaintenance, useMaintenanceMutations, useVehicles } from "@/hooks/use-data"
import { formatDate } from "@/lib/utils"
import { downloadCSV } from "@/lib/export"

const PRIORITY_CONFIG = {
  critique: { label: "Critique", variant: "destructive" as const, icon: AlertTriangle, color: "text-red-500 bg-red-50 dark:bg-red-900/20" },
  haute: { label: "Haute", variant: "warning" as const, icon: Clock, color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20" },
  normale: { label: "Normale", variant: "secondary" as const, icon: CheckCircle2, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
}

export function MaintenancePage() {
  const { data: items } = useMaintenance()
  const { data: vehicles } = useVehicles()
  const { create, complete } = useMaintenanceMutations()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ vehicleId: "", type: "Vidange", echeance: "", kmRestant: 1000 })

  const total = items?.length ?? 0
  const critical = items?.filter((m) => m.priorite === "critique").length ?? 0
  const haute = items?.filter((m) => m.priorite === "haute").length ?? 0

  const handlePlan = async () => {
    const vehicle = vehicles?.find((v) => v.id === form.vehicleId)
    if (!vehicle) {
      toast.error("Sélectionnez un véhicule")
      return
    }
    await create.mutateAsync({
      vehicleId: vehicle.id,
      vehicule: vehicle.immatriculation,
      type: form.type,
      echeance: form.echeance,
      kmRestant: form.kmRestant,
      priorite: form.kmRestant === 0 ? "critique" : "haute",
    })
    toast.success(`Intervention planifiée — ${vehicle.immatriculation}`)
    setOpen(false)
  }

  const handleComplete = async (id: string, type: string) => {
    await complete.mutateAsync(id)
    toast.success(`Intervention ${type} validée et archivée`)
  }

  const handleReport = () => {
    downloadCSV(
      `maintenance-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Véhicule", "Type", "Échéance", "Km restant", "Priorité"],
      (items ?? []).map((m) => [m.vehicule, m.type, m.echeance, m.kmRestant, m.priorite])
    )
    toast.success("Rapport maintenance exporté")
  }

  const stats = [
    { icon: Wrench, label: "À venir", value: total, sub: "interventions planifiées", color: "text-ivory-orange", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { icon: AlertTriangle, label: "Critiques", value: critical, sub: "intervention urgente", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    { icon: Clock, label: "Haute priorité", value: haute, sub: "à planifier sous 7j", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance"
        description="Vidanges, pneus, révisions et alertes préventives"
        action={{ label: "Planifier", onClick: () => setOpen(true) }}
      >
        <Button
          variant="outline"
          onClick={handleReport}
          className="rounded-2xl h-12 px-5 font-black uppercase tracking-widest text-[10px] gap-2"
        >
          <Download className="size-4" />
          Rapport CSV
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="rounded-3xl border-zinc-100 dark:border-zinc-800">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`flex size-11 items-center justify-center rounded-2xl ${s.bg} shrink-0`}>
                  <s.icon className={`size-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-inter font-black">{s.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground/70">{s.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <Card className="rounded-3xl border-zinc-100 dark:border-zinc-800">
        <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <Wrench className="size-3.5" />
            Calendrier des interventions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
                {["Véhicule", "Type d'intervention", "Échéance", "Km restant", "Priorité", ""].map((h) => (
                  <TableHead key={h} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground first:pl-6">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map((m, i) => {
                const pCfg = PRIORITY_CONFIG[m.priorite as keyof typeof PRIORITY_CONFIG] ?? PRIORITY_CONFIG.normale
                return (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <span className="font-mono font-bold text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                        {m.vehicule}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{m.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(m.echeance)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {m.kmRestant > 0 ? `${m.kmRestant.toLocaleString("fr-FR")} km` : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={pCfg.variant}
                        className="text-[9px] font-black uppercase tracking-widest rounded-full"
                      >
                        {pCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-xl text-xs font-bold hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 gap-1.5"
                        onClick={() => handleComplete(m.id, m.type)}
                      >
                        <CheckCircle2 className="size-3.5" />
                        Valider
                      </Button>
                    </TableCell>
                  </motion.tr>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight">Planifier une intervention</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest">Véhicule</Label>
              <Select value={form.vehicleId} onValueChange={(v) => setForm({ ...form, vehicleId: v })}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Choisir un véhicule..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {vehicles?.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.immatriculation} — {v.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest">Type d'intervention</Label>
              <Input
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Vidange, Freins, Pneus..."
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest">Date d'échéance</Label>
              <Input
                type="date"
                value={form.echeance}
                onChange={(e) => setForm({ ...form, echeance: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest">Km restant</Label>
              <Input
                type="number"
                value={form.kmRestant}
                onChange={(e) => setForm({ ...form, kmRestant: +e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-2xl" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button
              className="rounded-2xl bg-ivory-orange hover:bg-ivory-orange/90 text-white font-black uppercase tracking-widest text-xs"
              onClick={handlePlan}
              disabled={create.isPending}
            >
              Planifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
