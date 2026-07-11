import type { Alert, AppStore } from "@/types/entities"

const MS_PER_DAY = 86_400_000

function daysUntil(dateStr: string): number {
  const exp = new Date(dateStr)
  const now = new Date()
  return Math.ceil((exp.getTime() - now.getTime()) / MS_PER_DAY)
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / MS_PER_DAY)
}

export function computeAlerts(store: AppStore, agenceId?: string): Alert[] {
  const alerts: Alert[] = []
  const scope = <T extends { agenceId: string }>(items: T[]) =>
    agenceId ? items.filter((i) => i.agenceId === agenceId) : items

  for (const doc of scope(store.documents)) {
    const days = daysUntil(doc.expiration)
    if (days <= 30 && days >= 0) {
      alerts.push({
        id: `alert-doc-${doc.id}`,
        type: "document",
        message: `${doc.type} — ${doc.entite} expire dans ${days} jour${days > 1 ? "s" : ""}`,
        severity: days <= 15 ? "danger" : "warning",
        agenceId: doc.agenceId,
        entityId: doc.id,
        href: "/documents",
      })
    }
  }

  for (const item of scope(store.maintenanceItems)) {
    if (item.kmRestant <= 500) {
      alerts.push({
        id: `alert-maint-${item.id}`,
        type: "maintenance",
        message: `${item.vehicule} — ${item.type} (${item.kmRestant <= 0 ? "due maintenant" : `dans ${item.kmRestant} km`})`,
        severity: item.priorite === "critique" || item.kmRestant <= 0 ? "danger" : "warning",
        agenceId: item.agenceId,
        entityId: item.id,
        href: "/maintenance",
      })
    }
  }

  for (const mission of scope(store.missions)) {
    if (mission.statut === "en_retard") {
      alerts.push({
        id: `alert-mission-${mission.id}`,
        type: "mission",
        message: `Mission ${mission.id} en retard — ${mission.depart} → ${mission.destination}`,
        severity: "danger",
        agenceId: mission.agenceId,
        entityId: mission.id,
        href: "/missions",
      })
    }
  }

  for (const invoice of scope(store.invoices)) {
    if (invoice.statut === "en_retard") {
      alerts.push({
        id: `alert-inv-${invoice.id}`,
        type: "paiement",
        message: `Facture ${invoice.id} impayée — ${invoice.client}`,
        severity: "warning",
        agenceId: invoice.agenceId,
        entityId: invoice.id,
        href: "/billing",
      })
    }
  }

  for (const fuel of scope(store.fuelRecords)) {
    if (fuel.anomalie) {
      alerts.push({
        id: `alert-fuel-${fuel.id}`,
        type: "carburant",
        message: `Surconsommation — ${fuel.vehicule} (${fuel.conso} L/100km)`,
        severity: "info",
        agenceId: fuel.agenceId,
        entityId: fuel.id,
        href: "/fuel",
      })
    }
  }

  for (const vehicle of scope(store.vehicles)) {
    if (vehicle.statut === "immobilise") {
      const days = vehicle.immobiliseDepuis ? daysSince(vehicle.immobiliseDepuis) : 0
      if (days >= 3) {
        alerts.push({
          id: `alert-immob-${vehicle.id}`,
          type: "flotte",
          message: `${vehicle.immatriculation} immobilisé depuis ${days} jour${days > 1 ? "s" : ""} — action requise`,
          severity: "danger",
          agenceId: vehicle.agenceId,
          entityId: vehicle.id,
          href: "/fleet",
        })
      } else {
        alerts.push({
          id: `alert-veh-${vehicle.id}`,
          type: "maintenance",
          message: `${vehicle.immatriculation} immobilisé — vérifier disponibilité`,
          severity: "warning",
          agenceId: vehicle.agenceId,
          entityId: vehicle.id,
          href: "/fleet",
        })
      }
    }
  }

  return alerts.sort((a, b) => {
    const rank = { danger: 0, warning: 1, info: 2 }
    return rank[a.severity] - rank[b.severity]
  })
}
