import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bot, Mic, Send } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { aiSuggestions } from "@/lib/mock-data"
import { queryAiAssist } from "@/lib/api"
import { useTenant } from "@/lib/tenant"

interface Message {
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Bonjour ! Je suis votre assistant Djassa. Je réponds à partir de vos données opérationnelles en temps réel. Je ne prends jamais de décisions à votre place.",
  },
]

export function AiAssistPage() {
  const navigate = useNavigate()
  const { agenceId } = useTenant()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [listening, setListening] = useState(false)

  const handleSend = async (text?: string) => {
    const query = text ?? input
    if (!query.trim()) return

    setMessages((prev) => [...prev, { role: "user", content: query }])
    setInput("")

    try {
      const { answer } = await queryAiAssist(query, agenceId)
      setMessages((prev) => [...prev, { role: "assistant", content: answer }])
    } catch {
      toast.error("Impossible de contacter l'assistant")
    }
  }

  const handleMic = () => {
    setListening(true)
    toast.message("Dictée simulée", { description: "Transcription en cours..." })
    setTimeout(() => {
      const phrase = "Nouvelle mission client Nestlé CI de Abidjan à Bouaké cacao 20 tonnes"
      setInput(phrase)
      setListening(false)
      toast.success("Transcription terminée", {
        description: "Mission pré-remplie — ouvrir le formulaire ?",
        action: {
          label: "Créer la mission",
          onClick: () =>
            navigate(
              "/missions?create=1&client=Nestlé CI&depart=Abidjan&destination=Bouaké&marchandise=Cacao"
            ),
        },
      })
    }, 1200)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assistant IA"
        description="Analyse vos données live — missions, factures, flotte, alertes"
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
            <Badge variant="secondary" className="ml-auto">Données live</Badge>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-line ${
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
              <Button variant="outline" size="icon" onClick={handleMic} disabled={listening}>
                <Mic className={`size-4 ${listening ? "animate-pulse text-primary" : ""}`} />
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
