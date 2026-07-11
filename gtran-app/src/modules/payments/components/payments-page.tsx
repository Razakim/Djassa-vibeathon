import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePayments, usePaymentMutations, usePaymentGateways } from "@/hooks/use-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { PaymentStatusBadge } from "@/components/shared/status-badge"
import { cn } from "@/lib/utils"

const GATEWAYS = ["Wave", "Orange Money", "CinetPay", "Séquestre"] as const

export function PaymentsPage() {
  const { data: payments } = usePayments()
  const { create, releaseEscrow, testGateway } = usePaymentMutations()
  const { data: gatewayStatus } = usePaymentGateways()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ client: "", montant: 0, methode: "Wave" })

  const escrow = payments?.filter((p) => p.methode === "Séquestre" && p.statut === "en_attente") ?? []

  const handlePay = async () => {
    if (!form.client) return
    await create.mutateAsync({
      reference: `${form.methode.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-5)}`,
      client: form.client,
      montant: form.montant,
      methode: form.methode,
      statut: "paye",
      date: new Date().toISOString().slice(0, 10),
    })
    toast.success("Paiement enregistré")
    setOpen(false)
  }

  const handleRelease = async (id: string, client: string) => {
    await releaseEscrow.mutateAsync(id)
    toast.success(`Fonds séquestre libérés pour ${client}`)
  }

  const handleTestGateway = async (method: string) => {
    await testGateway.mutateAsync(method)
    toast.success(`${method} — connexion vérifiée`)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Paiements" description="Mobile Money, virements et séquestre" action={{ label: "Enregistrer un paiement", onClick: () => setOpen(true) }} />

      <div className="grid gap-4 md:grid-cols-4">
        {GATEWAYS.map((method) => {
          const connected = gatewayStatus?.[method]
          return (
            <Card key={method} className={cn(connected && "border-emerald-500/30")}>
              <CardContent className="pt-6 text-center">
                <Badge className="mb-2" variant={connected ? "success" : "secondary"}>
                  {connected && <CheckCircle2 className="size-3 mr-1" />}
                  {method}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  disabled={testGateway.isPending}
                  onClick={() => handleTestGateway(method)}
                >
                  {connected ? "Connecté" : "Tester"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="sequestre">Séquestre ({escrow.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Réf.</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments?.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono">{p.reference}</TableCell>
                      <TableCell>{p.client}</TableCell>
                      <TableCell>{formatCurrency(p.montant)}</TableCell>
                      <TableCell><Badge variant="secondary">{p.methode}</Badge></TableCell>
                      <TableCell>{formatDate(p.date)}</TableCell>
                      <TableCell><PaymentStatusBadge status={p.statut} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequestre" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Fonds en séquestre</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {escrow.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun fonds en séquestre</p>
              ) : (
                escrow.map((p) => (
                  <div key={p.id} className="flex justify-between items-center rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{p.client}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(p.montant)}</p>
                    </div>
                    <Button size="sm" onClick={() => handleRelease(p.id, p.client)}>Libérer</Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enregistrer un paiement</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Client</Label><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
            <div><Label>Montant</Label><Input type="number" value={form.montant} onChange={(e) => setForm({ ...form, montant: +e.target.value })} /></div>
            <div>
              <Label>Méthode</Label>
              <Select value={form.methode} onValueChange={(v) => setForm({ ...form, methode: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Wave", "Orange Money", "CinetPay", "Espèces", "Virement"].map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handlePay}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
