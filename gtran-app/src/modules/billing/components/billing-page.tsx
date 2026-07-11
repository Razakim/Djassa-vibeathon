import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInvoices, useInvoiceMutations } from "@/hooks/use-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { PaymentStatusBadge } from "@/components/shared/status-badge"
import type { PaymentStatus } from "@/types/shared"

export function BillingPage() {
  const navigate = useNavigate()
  const { data: invoices } = useInvoices()
  const { create, update, sendReminder } = useInvoiceMutations()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ client: "", montant: 0, echeance: "" })

  const overdue = invoices?.filter((i) => i.statut === "en_retard") ?? []

  const handleCreate = async () => {
    if (!form.client) return
    const invoice = await create.mutateAsync({ ...form, statut: "en_attente" })
    toast.success(`Facture ${invoice.id} créée`, {
      description: `${form.client} — ${formatCurrency(form.montant)}`,
    })
    setOpen(false)
  }

  const handleReminder = async (id: string, client: string) => {
    await sendReminder.mutateAsync(id)
    toast.success(`Relance envoyée — ${client}`, { description: `Facture ${id}` })
  }

  const markPaid = async (id: string, client: string) => {
    await update.mutateAsync({ id, statut: "paye" as PaymentStatus })
    toast.success(`Facture ${id} payée`, { description: client })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Facturation" description="Devis, factures, reçus et relances" action={{ label: "Nouvelle facture", onClick: () => setOpen(true) }} />

      <Tabs defaultValue="factures">
        <TabsList>
          <TabsTrigger value="factures">Factures</TabsTrigger>
          <TabsTrigger value="relances">Relances ({overdue.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="factures" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N°</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Mission</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices?.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono">{inv.id}</TableCell>
                      <TableCell>{inv.client}</TableCell>
                      <TableCell>
                        {inv.missionId ? (
                          <Button
                            variant="link"
                            className="h-auto p-0 font-mono text-xs"
                            onClick={() => navigate(`/missions`)}
                          >
                            {inv.missionId}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(inv.montant)}</TableCell>
                      <TableCell>{formatDate(inv.echeance)}</TableCell>
                      <TableCell><PaymentStatusBadge status={inv.statut} /></TableCell>
                      <TableCell>
                        {inv.statut !== "paye" && (
                          <Button size="sm" variant="ghost" onClick={() => markPaid(inv.id, inv.client)}>Marquer payée</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relances" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <p className="text-xs text-muted-foreground">
                Les relances automatiques sont envoyées chaque jour pour les factures en retard (Cas 8).
              </p>
              {overdue.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune relance en attente</p>
              ) : (
                overdue.map((inv) => (
                  <div key={inv.id} className="flex justify-between items-center rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{inv.client} — {inv.id}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(inv.montant)}</p>
                      {inv.lastReminderAt && (
                        <p className="text-xs text-muted-foreground">Dernière relance : {formatDate(inv.lastReminderAt)}</p>
                      )}
                    </div>
                    <Button size="sm" onClick={() => handleReminder(inv.id, inv.client)}>Envoyer relance</Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouvelle facture</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Client</Label><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
            <div><Label>Montant</Label><Input type="number" value={form.montant} onChange={(e) => setForm({ ...form, montant: +e.target.value })} /></div>
            <div><Label>Échéance</Label><Input type="date" value={form.echeance} onChange={(e) => setForm({ ...form, echeance: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleCreate}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
