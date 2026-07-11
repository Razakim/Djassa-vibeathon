import { buildRoute, getCityCoords, interpolateRoute } from "@/lib/geo/cities"
import type { Alert, AppStore } from "@/types/entities"
import {
  alerts,
  drivers,
  employees,
  fuelRecords,
  invoices,
  maintenanceItems,
  messages,
  missions,
  payments,
  vehicles,
  documents,
  agences,
  trackingVehicles,
} from "@/lib/mock-data"

const DEFAULT_AGENCE = "ag-1"

export function createSeedStore(): AppStore {
  const seededMissions = missions.map((m) => {
    const route = buildRoute(m.depart, m.destination)
    const progress =
      m.statut === "livree" ? 1 : m.statut === "planifiee" ? 0 : m.statut === "en_retard" ? 0.72 : 0.45
    return {
      ...m,
      agenceId: DEFAULT_AGENCE,
      route,
      progress,
    }
  })

  return {
    vehicles: vehicles.map((v) => ({
      ...v,
      agenceId: DEFAULT_AGENCE,
      position: v.statut === "en_mission" ? interpolateRoute(buildRoute("Abidjan", "Bouaké"), 0.5) : getCityCoords("Abidjan"),
    })),
    drivers: drivers.map((d) => ({ ...d, agenceId: DEFAULT_AGENCE })),
    missions: seededMissions,
    documents: documents.map((d) => ({ ...d, agenceId: DEFAULT_AGENCE })),
    invoices: invoices.map((i) => ({ ...i, agenceId: DEFAULT_AGENCE })),
    payments: payments.map((p) => ({ ...p, agenceId: DEFAULT_AGENCE })),
    maintenanceItems: maintenanceItems.map((m) => ({ ...m, agenceId: DEFAULT_AGENCE })),
    fuelRecords: fuelRecords.map((f) => ({ ...f, agenceId: DEFAULT_AGENCE })),
    employees: employees.map((e) => ({ ...e, agenceId: DEFAULT_AGENCE })),
    messages: messages.map((m) => ({
      ...m,
      body: m.subject,
      agenceId: DEFAULT_AGENCE,
    })),
    alerts: alerts.map((a) => ({ ...a, agenceId: DEFAULT_AGENCE, severity: a.severity as Alert["severity"] })),
    trackingVehicles: trackingVehicles.map((t, i) => ({
      ...t,
      coords: seededMissions[i]?.route
        ? interpolateRoute(seededMissions[i].route, seededMissions[i].progress)
        : getCityCoords("Abidjan"),
      missionId: seededMissions[i]?.id,
    })),
    agences: agences.map((a, i) => ({
      ...a,
      ville: ["Abidjan", "Bouaké", "San Pedro"][i] ?? "Abidjan",
    })),
    accounts: [
      {
        id: "u-1",
        nom: "Amadou Diallo",
        email: "amadou@transafrique.ci",
        password: "demo123",
        role: "Directeur exploitation",
        entrepriseId: "ent-1",
      },
    ],
  }
}
