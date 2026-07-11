import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { vehicles } from "@/lib/mock-data"
import { VehicleStatusBadge } from "@/components/shared/status-badge"

export function FleetPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion de flotte"
        description="Camions, remorques, utilitaires — état, disponibilité et historique"
        action={{ label: "Ajouter un véhicule" }}
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input placeholder="Rechercher par immatriculation..." className="pl-9" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((v) => (
          <Card key={v.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-mono">{v.immatriculation}</CardTitle>
              <VehicleStatusBadge status={v.statut} />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">{v.type}</div>
              {v.chauffeur && (
                <div className="text-sm">Chauffeur : <span className="text-foreground">{v.chauffeur}</span></div>
              )}
              <div className="text-sm">
                Kilométrage : <span className="font-medium">{v.km.toLocaleString("fr-FR")} km</span>
              </div>
              <div className="text-sm">
                Consommation : <span className="font-medium">{v.conso} L/100km</span>
              </div>
              {v.statut === "disponible" && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Disponibilité</span>
                    <span>{v.disponibilite}%</span>
                  </div>
                  <Progress value={v.disponibilite} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
