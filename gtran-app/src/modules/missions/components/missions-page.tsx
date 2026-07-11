import { useMemo, useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { TransportMap } from "@/components/map/transport-map"
import { MissionWizardDialog, type MissionFormData } from "@/components/missions/mission-wizard-dialog"
import { MissionStatusBadge } from "@/components/shared/status-badge"
import { formatCurrency } from "@/lib/utils"
import { useMissions, useMissionMutations, useDrivers, useVehicles } from "@/hooks/use-data"
import { interpolateRoute } from "@/lib/geo/cities"
import type { MissionStatus } from "@/types/shared"
import { Search, Trash2, Play, CheckCircle, XCircle } from "lucide-react"

export function MissionsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: missions, isLoading } = useMissions()
  const { data: drivers } = useDrivers()
  const { data: vehicles } = useVehicles()
  const { create, transition, remove } = useMissionMutations()
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setDialogOpen(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

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

  const handleCreate = async (form: MissionFormData) => {
    try {
      const result = await create.mutateAsync({
        client: form.client,
        depart: form.depart,
        destination: form.destination,
        marchandise: form.marchandise,
        poids: form.poids,
        driverId: form.driverId || undefined,
        vehicleId: form.vehicleId || undefined,
        prix: form.prix,
        cout: form.cout,
      })
      toast.success(`Mission ${result.id} créée`, {
        description: `${result.chauffeur} — ${result.vehicule}`,
        action: {
          label: "Voir sur la carte",
          onClick: () => navigate(`/tracking?mission=${result.id}`),
        },
      })
      setDialogOpen(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur à la création")
      throw e
    }
  }

  const changeStatus = async (id: string, statut: MissionStatus) => {
    try {
      const result = await transition.mutateAsync({ id, statut })
      const m = result.mission
      if (statut === "en_cours") {
        toast.success(`Mission ${m.id} démarrée`, {
          description: `${m.vehicule} en route vers ${m.destination}`,
          action: {
            label: "Voir sur la carte",
            onClick: () => navigate(`/tracking?mission=${m.id}`),
          },
        })
      } else if (statut === "livree") {
        toast.success(`Mission ${m.id} livrée`, {
          description: result.invoice ? `Facture ${result.invoice.id} générée` : undefined,
          action: result.invoice
            ? {
                label: "Voir la facture",
                onClick: () => navigate("/billing"),
              }
            : undefined,
        })
      } else if (statut === "annulee") {
        toast.info(`Mission ${m.id} annulée`, { description: "Véhicule et chauffeur libérés" })
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Transition impossible")
    }
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
                          <>
                            <Button size="icon" variant="ghost" title="Livrer" onClick={() => changeStatus(m.id, "livree")}>
                              <CheckCircle className="size-4" />
                            </Button>
                            <Button size="icon" variant="ghost" title="Annuler" onClick={() => changeStatus(m.id, "annulee")}>
                              <XCircle className="size-4 text-destructive" />
                            </Button>
                          </>
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

      <MissionWizardDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        drivers={drivers ?? []}
        vehicles={vehicles ?? []}
        loading={create.isPending}
        onSubmit={handleCreate}
      />

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
            try {
              await remove.mutateAsync(deleteId)
              toast.success("Mission supprimée")
              setDeleteId(null)
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Suppression impossible")
            }
          }
        }}
      />
    </div>
  )
}
