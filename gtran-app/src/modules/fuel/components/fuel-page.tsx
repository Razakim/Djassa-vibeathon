import { useState } from "react"
import { AlertTriangle, Fuel } from "lucide-react"
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
import { useFuelRecords, useFuelMutations, useVehicles } from "@/hooks/use-data"
import { formatCurrency, formatDate } from "@/lib/utils"

export function FuelPage() {
  const { data: records } = useFuelRecords()
  const { data: vehicles } = useVehicles()
  const { create } = useFuelMutations()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ vehicleId: "", station: "", litres: 0, montant: 0, conso: 30 })

  const total = records?.reduce((s, f) => s + f.montant, 0) ?? 0
  const anomalies = records?.filter((f) => f.anomalie) ?? []
  const avgConso = records?.length ? (records.reduce((s, f) => s + f.conso, 0) / records.length).toFixed(1) : "0"

  const handleAdd = async () => {
    const vehicle = vehicles?.find((v) => v.id === form.vehicleId)
    if (!vehicle) {
      toast.error("Sélectionnez un véhicule")
      return
    }
    const anomalie = form.conso > 38
    await create.mutateAsync({
      vehicleId: vehicle.id,
      vehicule: vehicle.immatriculation,
      station: form.station,
      litres: form.litres,
      montant: form.montant,
      conso: form.conso,
      anomalie,
      date: new Date().toISOString().slice(0, 10),
    })
    toast.success(anomalie ? `Plein enregistré — ${vehicle.immatriculation} (anomalie)` : `Plein enregistré — ${vehicle.immatriculation}`)
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gestion du carburant" description="Pleins, consommation et anomalies" action={{ label: "Enregistrer un plein", onClick: () => setOpen(true) }} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6 flex items-center gap-3"><Fuel className="size-8 text-blue-400" /><div><p className="text-2xl font-bold">{formatCurrency(total)}</p><p className="text-sm text-muted-foreground">Ce mois</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{avgConso} L</p><p className="text-sm text-muted-foreground">Moyenne /100km</p></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><AlertTriangle className="size-8 text-amber-400" /><div><p className="text-2xl font-bold">{anomalies.length}</p><p className="text-sm text-muted-foreground">Anomalies</p></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Litres</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Conso</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Anomalie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records?.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-mono">{f.vehicule}</TableCell>
                  <TableCell>{f.station}</TableCell>
                  <TableCell>{f.litres} L</TableCell>
                  <TableCell>{formatCurrency(f.montant)}</TableCell>
                  <TableCell>{f.conso}</TableCell>
                  <TableCell>{formatDate(f.date)}</TableCell>
                  <TableCell>{f.anomalie ? <Badge variant="warning">Surconso</Badge> : <Badge variant="success">OK</Badge>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enregistrer un plein</DialogTitle></DialogHeader>
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
            <div><Label>Station</Label><Input value={form.station} onChange={(e) => setForm({ ...form, station: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Litres</Label><Input type="number" value={form.litres} onChange={(e) => setForm({ ...form, litres: +e.target.value })} /></div>
              <div><Label>Montant</Label><Input type="number" value={form.montant} onChange={(e) => setForm({ ...form, montant: +e.target.value })} /></div>
              <div><Label>Conso</Label><Input type="number" value={form.conso} onChange={(e) => setForm({ ...form, conso: +e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleAdd}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
