import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { messages } from "@/lib/mock-data"

export function CommunicationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Centre de communication"
        description="Messagerie interne, notifications, consignes et partage de documents"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 border-b p-4 cursor-pointer hover:bg-muted/50 ${msg.unread ? "bg-muted/30" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{msg.from}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{msg.subject}</p>
                  {msg.unread && <Badge variant="info" className="w-fit">Nouveau</Badge>}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Mission M-2049 — chauffeur assigné</CardTitle>
            <p className="text-sm text-muted-foreground">De Fatou Bamba — Aujourd'hui 08:32</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              Bonjour, la mission M-2049 (Abidjan → Yamoussoukro, Nestlé CI) a été assignée à Koné Ibrahim
              sur le camion CI-5567-IJ. Départ prévu demain 06h00. Merci de confirmer la disponibilité du véhicule.
            </div>
            <div className="flex gap-2">
              <Input placeholder="Répondre..." className="flex-1" />
              <Button size="icon"><Send className="size-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
