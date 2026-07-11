import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Bot, Mic, Send, Sparkles, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { aiSuggestions } from "@/lib/mock-data"
import { answerAiQuery } from "@/lib/ai-assist-engine"
import { useTenant } from "@/lib/tenant"

interface Message {
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Bonjour ! Je suis votre assistant Djassa IA. J'analyse vos données opérationnelles en temps réel — missions, flotte, finances et alertes. Comment puis-je vous aider aujourd'hui ?",
  },
]

export function AiAssistPage() {
  const navigate = useNavigate()
  const { agenceId } = useTenant()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text?: string) => {
    const query = text ?? input
    if (!query.trim()) return

    const userMsg: Message = { role: "user", content: query }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    // Simulate slight AI delay for realism
    setTimeout(() => {
      const answer = answerAiQuery(query, agenceId)
      setMessages((prev) => [...prev, { role: "assistant", content: answer }])
      setLoading(false)
    }, 600)
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
        {/* Suggestions panel */}
        <Card className="lg:col-span-1 rounded-3xl border-zinc-100 dark:border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="size-3.5 text-ivory-orange" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {aiSuggestions.map((s) => (
              <motion.button
                key={s}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleSend(s)}
                className="w-full text-left text-xs font-medium rounded-2xl border border-zinc-100 dark:border-zinc-800 p-3 hover:border-ivory-emerald/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors flex items-start justify-between gap-2 group"
              >
                <span className="leading-relaxed">{s}</span>
                <ChevronRight className="size-3 shrink-0 mt-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}
          </CardContent>
        </Card>

        {/* Chat panel */}
        <Card className="lg:col-span-3 flex flex-col h-[560px] rounded-3xl border-zinc-100 dark:border-zinc-800">
          <CardHeader className="flex-row items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-ivory-emerald/10">
              <Bot className="size-5 text-ivory-emerald" />
            </div>
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight">
                Djassa IA
              </CardTitle>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Analyse en temps réel
              </p>
            </div>
            <Badge className="ml-auto bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border-0">
              ● En ligne
            </Badge>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex size-7 items-center justify-center rounded-xl bg-ivory-emerald/10 shrink-0 mr-2 mt-0.5">
                        <Bot className="size-3.5 text-ivory-emerald" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-ivory-emerald text-white font-medium rounded-br-sm"
                          : "bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm border border-zinc-100 dark:border-zinc-700"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex size-7 items-center justify-center rounded-xl bg-ivory-emerald/10 shrink-0 mr-2 mt-0.5">
                      <Bot className="size-3.5 text-ivory-emerald" />
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 border border-zinc-100 dark:border-zinc-700">
                      <div className="flex gap-1.5 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="size-2 rounded-full bg-ivory-emerald/60"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-2 focus-within:ring-2 focus-within:ring-ivory-emerald/30 focus-within:border-ivory-emerald transition-all">
              <Button
                variant="ghost"
                size="icon"
                className={`shrink-0 rounded-xl size-9 ${listening ? "bg-red-50 text-red-500" : "text-muted-foreground hover:text-ivory-orange"}`}
                onClick={handleMic}
                disabled={listening}
              >
                <Mic className={`size-4 ${listening ? "animate-pulse" : ""}`} />
              </Button>
              <input
                type="text"
                placeholder="Posez votre question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
              />
              <Button
                size="icon"
                className="shrink-0 rounded-xl size-9 bg-ivory-emerald hover:bg-ivory-emerald/90 text-white shadow-sm"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
              >
                <Send className="size-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
