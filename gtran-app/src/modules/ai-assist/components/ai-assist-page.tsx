import { useState } from "react"
import { Bot, Mic, Send } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { aiSuggestions } from "@/lib/mock-data"

interface Message {
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Bonjour ! Je suis votre assistant Gtran. Je peux vous aider à analyser vos données, résumer des missions ou répondre à vos questions sur la rentabilité. Je ne prends jamais de décisions à votre place.",
  },
]

export function AiAssistPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  const handleSend = (text?: string) => {
    const query = text ?? input
    if (!query.trim()) return

    setMessages((prev) => [
      ...prev,
      { role: "user", content: query },
      {
        role: "assistant",
        content: getMockResponse(query),
      },
    ])
    setInput("")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assistant IA"
        description="Transcription vocale, remplissage auto, rapports et Q&A — assiste sans décider"
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {aiSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="w-full text-left text-sm rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col h-[520px]">
          <CardHeader className="flex-row items-center gap-2">
            <Bot className="size-5 text-primary" />
            <CardTitle className="text-base">Conversation</CardTitle>
            <Badge variant="secondary" className="ml-auto">Mode assistance</Badge>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Mic className="size-4" />
              </Button>
              <Input
                placeholder="Posez votre question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button size="icon" onClick={() => handleSend()}>
                <Send className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getMockResponse(query: string): string {
  const q = query.toLowerCase()
  if (q.includes("coûté le plus cher") || q.includes("camions")) {
    return "Ce mois-ci, les camions les plus coûteux sont :\n1. CI-7745-EF — 4,2 M XOF (réparations freins)\n2. CI-3312-CD — 3,1 M XOF (carburant + surconsommation)\n3. CI-4521-BX — 2,8 M XOF (opérationnel)"
  }
  if (q.includes("retard") && q.includes("client")) {
    return "Clients avec retards de paiement récurrents :\n• SITAB — 3 factures en retard (moy. 38 jours)\n• SOCOPRIM — 1 facture en retard (22 jours)\nRelance automatique activée pour SITAB."
  }
  if (q.includes("m-2048") || q.includes("bénéfice")) {
    return "Mission M-2048 (CFAO Motors, San Pedro → Abidjan) :\n• Prix de vente : 2 400 000 XOF\n• Coûts : 1 450 000 XOF (carburant 520k, péages 180k, salaire 450k, autres 300k)\n• Bénéfice net : 950 000 XOF (39,6% de marge)"
  }
  if (q.includes("retard") && q.includes("mission")) {
    return "Missions en retard aujourd'hui :\n• M-2047 (SITAB, Abidjan→Bouaké) — retard 2h30, chauffeur Kouassi Jean\nCause probable : arrêt prolongé à PK 142."
  }
  return "Je peux analyser vos données opérationnelles pour répondre à cette question. Connectez l'API backend pour des réponses en temps réel basées sur vos données réelles."
}
