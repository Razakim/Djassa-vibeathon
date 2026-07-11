import { useState } from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMessages, useMessageMutations } from "@/hooks/use-data"
import { useAuth } from "@/lib/auth"

export function CommunicationPage() {
  const { data: messages } = useMessages()
  const { send, markRead } = useMessageMutations()
  const { user } = useAuth()
  const [selectedId, setSelectedId] = useState(messages?.[0]?.id ?? "")
  const [reply, setReply] = useState("")

  const selected = messages?.find((m) => m.id === selectedId)

  const handleSelect = (id: string) => {
    setSelectedId(id)
    markRead.mutate(id)
  }

  const handleSend = async () => {
    if (!reply.trim() || !selected) return
    await send.mutateAsync({
      from: user?.nom ?? "Moi",
      subject: `Re: ${selected.subject}`,
      body: reply,
    })
    toast.success("Message envoyé")
    setReply("")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Centre de communication" description="Messagerie interne, notifications et consignes" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Messages</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {messages?.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg.id)}
                  className={`flex w-full flex-col gap-1 border-b p-4 text-left hover:bg-muted/50 transition-colors ${msg.unread ? "bg-muted/30" : ""} ${selectedId === msg.id ? "border-l-2 border-l-primary" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{msg.from}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{msg.subject}</p>
                  {msg.unread && <Badge variant="info" className="w-fit">Nouveau</Badge>}
                </button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selected ? (
            <>
              <CardHeader>
                <CardTitle className="text-base">{selected.subject}</CardTitle>
                <p className="text-sm text-muted-foreground">De {selected.from} — {selected.time}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4 text-sm">{selected.body}</div>
                <div className="flex gap-2">
                  <Input placeholder="Répondre..." value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="flex-1" />
                  <Button size="icon" onClick={handleSend} disabled={!reply.trim()}><Send className="size-4" /></Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="pt-6 text-muted-foreground text-sm">Sélectionnez un message</CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
