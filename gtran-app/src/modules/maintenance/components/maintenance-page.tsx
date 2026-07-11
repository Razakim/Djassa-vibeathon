import { useState } from "react"
import { Wrench } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
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

export function MaintenancePage() {
  const { data: items } = useMaintenance()
  const { data: vehicles } = useVehicles()
  const { create, complete } = useMaintenanceMutations()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ vehicleId: "", type: "Vidange", echeance: "", kmRestant: 1000 })

  const critical = items?.filter((m) => m.priorite === "critique").length ?? 0

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

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance" description="Vidanges, pneus, révisions et alertes" action={{ label: "Planifier", onClick: () => setOpen(true) }} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6 flex items-center gap-3"><Wrench className="size-8 text-amber-500" /><div><p className="text-2xl font-bold">{items?.length ?? 0}</p><p className="text-sm text-muted-foreground">À venir</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-2xl font-bold text-red-500">{critical}</p><p className="text-sm text-muted-foreground">Critiques</p></CardContent></Card>
        <Card><CardContent className="pt-6"><Button className="w-full" variant="outline" onClick={handleReport}>Générer rapport</Button></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Km restant</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono">{m.vehicule}</TableCell>
                  <TableCell>{m.type}</TableCell>
                  <TableCell>{formatDate(m.echeance)}</TableCell>
                  <TableCell>{m.kmRestant > 0 ? `${m.kmRestant} km` : "—"}</TableCell>
                  <TableCell><Badge variant={m.priorite === "critique" ? "destructive" : m.priorite === "haute" ? "warning" : "secondary"}>{m.priorite}</Badge></TableCell>
                  <TableCell><Button size="sm" variant="ghost" onClick={() => handleComplete(m.id, m.type)}>Valider</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Planifier une intervention</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>Véhicule</Label>
              <Select value={form.vehicleId} onValueChange={(v) => setForm({ ...form, vehicleId: v })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Choisir un véhicule..." /></SelectTrigger>
                <SelectContent>
                  {vehicles?.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.immatriculation} — {v.type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Type</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
            <div><Label>Échéance</Label><Input type="date" value={form.echeance} onChange={(e) => setForm({ ...form, echeance: e.target.value })} /></div>
            <div><Label>Km restant</Label><Input type="number" value={form.kmRestant} onChange={(e) => setForm({ ...form, kmRestant: +e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handlePlan}>Planifier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
