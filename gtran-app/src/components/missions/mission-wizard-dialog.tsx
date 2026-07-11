import { useState } from "react"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import type { Driver, Vehicle } from "@/types/entities"
import { cn } from "@/lib/utils"

const CITIES = ["Abidjan", "Bouaké", "San Pedro", "Yamoussoukro", "Dakar", "Ferkessédougou"]

const STEPS = ["Client & trajet", "Marchandise", "Assignation", "Récapitulatif"]

export interface MissionFormData {
  client: string
  depart: string
  destination: string
  marchandise: string
  poids: string
  driverId: string
  vehicleId: string
  prix: number
  cout: number
}

const INITIAL: MissionFormData = {
  client: "",
  depart: "Abidjan",
  destination: "Bouaké",
  marchandise: "",
  poids: "20 t",
  driverId: "",
  vehicleId: "",
  prix: 1_000_000,
  cout: 600_000,
}

interface MissionWizardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  drivers: Driver[]
  vehicles: Vehicle[]
  loading?: boolean
  onSubmit: (data: MissionFormData) => Promise<void>
}

export function MissionWizardDialog({
  open,
  onOpenChange,
  drivers,
  vehicles,
  loading,
  onSubmit,
}: MissionWizardDialogProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<MissionFormData>(INITIAL)

  const availableDrivers = drivers.filter((d) => d.statut === "disponible")
  const availableVehicles = vehicles.filter((v) => v.statut === "disponible")

  const selectedDriver = drivers.find((d) => d.id === form.driverId)
  const selectedVehicle = vehicles.find((v) => v.id === form.vehicleId)

  const reset = () => {
    setStep(0)
    setForm(INITIAL)
  }

  const handleClose = (value: boolean) => {
    if (!value) reset()
    onOpenChange(value)
  }

  const autoAssign = () => {
    const driver = availableDrivers[0]
    const vehicle = availableVehicles[0]
    setForm((f) => ({
      ...f,
      driverId: driver?.id ?? "",
      vehicleId: vehicle?.id ?? "",
    }))
    if (driver && vehicle) {
      toast.message("Assignation automatique", { description: `${driver.nom} + ${vehicle.immatriculation}` })
    }
  }

  const canNext = () => {
    if (step === 0) return form.client.trim().length > 0 && form.depart !== form.destination
    if (step === 1) return form.marchandise.trim().length > 0 && form.prix > 0
    return true
  }

  const handleNext = () => {
    if (!canNext()) {
      toast.error("Complétez les champs obligatoires")
      return
    }
    if (step < STEPS.length - 1) setStep((s) => s + 1)
    else {
      onSubmit(form)
        .then(() => reset())
        .catch(() => {})
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle mission</DialogTitle>
        </DialogHeader>

        <div className="flex gap-1">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={cn(
                "flex-1 h-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-muted"
              )}
              title={label}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Étape {step + 1}/{STEPS.length} — {STEPS[step]}
        </p>

        {step === 0 && (
          <div className="grid gap-3">
            <div>
              <Label>Client</Label>
              <Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Nom du client" />
            </div>
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
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-3">
            <div>
              <Label>Marchandise</Label>
              <Input value={form.marchandise} onChange={(e) => setForm({ ...form, marchandise: e.target.value })} />
            </div>
            <div>
              <Label>Poids</Label>
              <Input value={form.poids} onChange={(e) => setForm({ ...form, poids: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Prix de vente (XOF)</Label>
                <Input type="number" value={form.prix} onChange={(e) => setForm({ ...form, prix: +e.target.value })} />
              </div>
              <div>
                <Label>Coût estimé (XOF)</Label>
                <Input type="number" value={form.cout} onChange={(e) => setForm({ ...form, cout: +e.target.value })} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Marge estimée : {formatCurrency(form.prix - form.cout)} ({form.prix > 0 ? (((form.prix - form.cout) / form.prix) * 100).toFixed(1) : 0}%)
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-3">
            <div className="flex items-end gap-2">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <Label>Chauffeur</Label>
                  <Select value={form.driverId} onValueChange={(v) => setForm({ ...form, driverId: v })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Auto..." /></SelectTrigger>
                    <SelectContent>
                      {availableDrivers.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Véhicule</Label>
                  <Select value={form.vehicleId} onValueChange={(v) => setForm({ ...form, vehicleId: v })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Auto..." /></SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id}>{v.immatriculation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="button" variant="outline" size="icon" onClick={autoAssign} title="Assignation auto">
                <Sparkles className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Laissez vide pour une assignation automatique des ressources disponibles.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-lg border p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Client</span><span className="font-medium">{form.client}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Trajet</span><span>{form.depart} → {form.destination}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Marchandise</span><span>{form.marchandise} ({form.poids})</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Chauffeur</span><span>{selectedDriver?.nom ?? "Auto"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Véhicule</span><span>{selectedVehicle?.immatriculation ?? "Auto"}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="text-muted-foreground">Prix / Coût</span><span>{formatCurrency(form.prix)} / {formatCurrency(form.cout)}</span></div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>Retour</Button>
          )}
          <Button variant="outline" onClick={() => handleClose(false)}>Annuler</Button>
          <Button onClick={handleNext} disabled={loading}>
            {step < STEPS.length - 1 ? "Suivant" : loading ? "Création..." : "Créer la mission"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
