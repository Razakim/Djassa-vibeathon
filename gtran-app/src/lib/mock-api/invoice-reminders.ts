import type { AppStore, Invoice, Message } from "@/types/entities"
import { uid } from "./store"
import { refreshStoreAlerts } from "./mission-workflow"

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
}

function markOverdue(invoices: Invoice[]): Invoice[] {
  const today = new Date().toISOString().slice(0, 10)
  return invoices.map((inv) => {
    if (inv.statut === "paye") return inv
    if (inv.echeance < today && (inv.statut === "en_attente" || inv.statut === "partiel")) {
      return { ...inv, statut: "en_retard" as const }
    }
    return inv
  })
}

export function processInvoiceReminders(store: AppStore): AppStore {
  const today = new Date().toISOString().slice(0, 10)
  let messages = [...store.messages]
  const invoices = markOverdue(store.invoices).map((inv) => {
    if (inv.statut !== "en_retard") return inv
    if (inv.lastReminderAt === today) return inv

    const overdueDays = daysSince(inv.echeance)
    if (overdueDays < 1) return inv

    const msg: Message = {
      id: uid("msg"),
      from: "Système",
      subject: `Relance automatique — ${inv.id}`,
      body: `Relance envoyée à ${inv.client} : facture ${inv.id} impayée depuis ${overdueDays} jour(s) (${inv.montant.toLocaleString("fr-FR")} XOF).`,
      time: "À l'instant",
      unread: true,
      agenceId: inv.agenceId,
    }
    messages.push(msg)
    return { ...inv, lastReminderAt: today }
  })

  return refreshStoreAlerts({ ...store, invoices, messages })
}
