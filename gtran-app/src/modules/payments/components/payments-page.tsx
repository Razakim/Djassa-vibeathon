import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { payments } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { PaymentStatusBadge } from "@/components/shared/status-badge"

export function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Paiements"
        description="Mobile Money, virements, espèces et séquestre"
        action={{ label: "Enregistrer un paiement" }}
      />

      <div className="grid gap-4 md:grid-cols-4">
        {["Wave", "Orange Money", "CinetPay", "Séquestre"].map((method) => (
          <Card key={method}>
            <CardContent className="pt-6 text-center">
              <Badge className="mb-2">{method}</Badge>
              <p className="text-sm text-muted-foreground">Connecté</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="sequestre">Séquestre</TabsTrigger>
          <TabsTrigger value="acomptes">Acomptes</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
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
            <CardHeader>
              <CardTitle>Fonds en séquestre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(2_400_000)}</p>
              <p className="text-sm text-muted-foreground mt-1">CFAO Motors — libération à la livraison confirmée</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acomptes" className="mt-4">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Nestlé CI — acompte de {formatCurrency(500_000)} reçu sur facture F-1091 ({formatCurrency(980_000)}).
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
