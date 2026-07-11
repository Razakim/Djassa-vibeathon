import { getStore } from "@/lib/mock-api/store"
import { computeMissionProfit, formatMissionProfitText } from "@/lib/mission-profit"
import { computeAlerts } from "@/lib/mock-api/alerts-engine"

function byAgence<T extends { agenceId: string }>(items: T[], agenceId?: string): T[] {
  return agenceId ? items.filter((i) => i.agenceId === agenceId) : items
}

function fmt(n: number) {
  return n.toLocaleString("fr-FR")
}

export function answerAiQuery(query: string, agenceId?: string): string {
  const store = getStore()
  const q = query.toLowerCase()

  if (q.includes("coûté le plus cher") || q.includes("couté le plus cher") || (q.includes("camion") && q.includes("cher"))) {
    const costs = byAgence(store.vehicles, agenceId).map((v) => {
      const fuel = byAgence(store.fuelRecords, agenceId)
        .filter((f) => f.vehicleId === v.id)
        .reduce((s, f) => s + f.montant, 0)
      const maint = byAgence(store.maintenanceItems, agenceId)
        .filter((m) => m.vehicleId === v.id)
        .length * 150_000
      return { immat: v.immatriculation, total: fuel + maint + v.km * 50 }
    })
    costs.sort((a, b) => b.total - a.total)
    const top = costs.slice(0, 3)
    if (top.length === 0) return "Aucun véhicule trouvé pour cette agence."
    return (
      "Camions les plus coûteux (carburant + maintenance estimée) :\n" +
      top.map((c, i) => `${i + 1}. ${c.immat} — ${fmt(c.total)} XOF`).join("\n")
    )
  }

  if (q.includes("client") && (q.includes("retard") || q.includes("payer") || q.includes("payent"))) {
    const overdue = byAgence(store.invoices, agenceId).filter((i) => i.statut === "en_retard" || i.statut === "partiel")
    const byClient = new Map<string, { count: number; montant: number }>()
    for (const inv of overdue) {
      const cur = byClient.get(inv.client) ?? { count: 0, montant: 0 }
      byClient.set(inv.client, { count: cur.count + 1, montant: cur.montant + inv.montant })
    }
    if (byClient.size === 0) return "Aucun client en retard de paiement pour cette agence."
    const lines = [...byClient.entries()]
      .sort((a, b) => b[1].montant - a[1].montant)
      .map(([client, d]) => `• ${client} — ${d.count} facture(s), ${fmt(d.montant)} XOF`)
    return `Clients avec paiements en retard :\n${lines.join("\n")}\n\nRelances automatiques actives pour les factures en retard.`
  }

  if (q.includes("bénéfice") || q.includes("benefice") || /m-[a-z0-9]+/i.test(q)) {
    const match = q.match(/m-[a-z0-9]+/i)
    const mission = match
      ? byAgence(store.missions, agenceId).find((m) => m.id.toLowerCase() === match[0].toLowerCase())
      : byAgence(store.missions, agenceId).find((m) => m.statut === "en_cours" || m.statut === "livree")
    if (!mission) return "Mission introuvable. Précisez l'ID (ex. M-2048)."
    const breakdown = computeMissionProfit(mission, byAgence(store.fuelRecords, agenceId))
    return formatMissionProfitText(mission, breakdown)
  }

  if (q.includes("retard") && q.includes("mission")) {
    const late = byAgence(store.missions, agenceId).filter((m) => m.statut === "en_retard")
    if (late.length === 0) return "Aucune mission en retard actuellement."
    return (
      "Missions en retard :\n" +
      late
        .map((m) => `• ${m.id} (${m.client}, ${m.depart}→${m.destination}) — ${m.chauffeur}, ${m.vehicule}`)
        .join("\n")
    )
  }

  if (q.includes("résum") || q.includes("resum") || q.includes("tournée") || q.includes("tournee")) {
    const active = byAgence(store.missions, agenceId).filter((m) => m.statut === "en_cours" || m.statut === "en_retard")
    const planned = byAgence(store.missions, agenceId).filter((m) => m.statut === "planifiee")
    return [
      `Résumé opérationnel :`,
      `• ${active.length} mission(s) en cours`,
      `• ${planned.length} planifiée(s)`,
      `• ${byAgence(store.vehicles, agenceId).filter((v) => v.statut === "disponible").length} véhicule(s) disponible(s)`,
      `• ${computeAlerts(store, agenceId).length} alerte(s) active(s)`,
      active.length
        ? "\nEn route :\n" + active.map((m) => `• ${m.id} : ${m.depart}→${m.destination} (${Math.round(m.progress * 100)}%)`).join("\n")
        : "",
    ].join("\n")
  }

  if (q.includes("disponible") && q.includes("chauffeur")) {
    const dispo = byAgence(store.drivers, agenceId).filter((d) => d.statut === "disponible")
    if (dispo.length === 0) return "Aucun chauffeur disponible."
    return `Chauffeurs disponibles :\n${dispo.map((d) => `• ${d.nom} (${d.categorie}, ponctualité ${d.ponctualite}%)`).join("\n")}`
  }

  return "Je peux répondre sur : coûts par camion, clients en retard, bénéfice d'une mission, missions en retard, résumé de tournée, chauffeurs disponibles. Posez une question précise."
}
