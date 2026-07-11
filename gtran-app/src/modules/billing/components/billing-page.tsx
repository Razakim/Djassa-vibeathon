import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { invoices } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { PaymentStatusBadge } from "@/components/shared/status-badge"

export function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Facturation"
        description="Devis, factures, reçus et relances automatiques"
        action={{ label: "Nouvelle facture" }}
      />

      <Tabs defaultValue="factures">
        <TabsList>
          <TabsTrigger value="factures">Factures</TabsTrigger>
          <TabsTrigger value="devis">Devis</TabsTrigger>
          <TabsTrigger value="relances">Relances</TabsTrigger>
        </TabsList>

        <TabsContent value="factures" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono">{inv.id}</TableCell>
                      <TableCell>{inv.client}</TableCell>
                      <TableCell>{formatCurrency(inv.montant)}</TableCell>
                      <TableCell>{formatDate(inv.echeance)}</TableCell>
                      <TableCell><PaymentStatusBadge status={inv.statut} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devis" className="mt-4">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              3 devis en attente de validation client. Génération automatique depuis les missions planifiées.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relances" className="mt-4">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Relance automatique programmée pour SITAB (F-1089) — impayé depuis 45 jours. Prochaine relance : J+3.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
