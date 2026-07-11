import { MapPin, Navigation } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { trackingVehicles } from "@/lib/mock-data"

export function TrackingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Suivi GPS temps réel"
        description="Position des camions, chauffeurs et missions en direct"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="flex h-[420px] items-center justify-center rounded-lg bg-muted/30 border-b">
              <div className="text-center text-muted-foreground">
                <MapPin className="size-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Carte interactive</p>
                <p className="text-sm mt-1">Afrique de l'Ouest — {trackingVehicles.length} véhicules suivis</p>
                <div className="flex justify-center gap-4 mt-4">
                  {trackingVehicles.map((v) => (
                    <div key={v.id} className="flex items-center gap-1 text-xs">
                      <span className={`size-2 rounded-full ${v.statut === "en_route" ? "bg-emerald-400" : v.statut === "arret" ? "bg-amber-400" : "bg-blue-400"}`} />
                      {v.immatriculation}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="size-4" />
              Flotte en direct
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trackingVehicles.map((v) => (
              <div key={v.id} className="rounded-lg border p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium">{v.immatriculation}</span>
                  <Badge variant={v.statut === "en_route" ? "success" : v.statut === "arret" ? "warning" : "info"}>
                    {v.vitesse} km/h
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{v.chauffeur}</p>
                <p className="text-sm">{v.position}</p>
                <p className="text-xs text-muted-foreground">Arrêt : {v.arret}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
