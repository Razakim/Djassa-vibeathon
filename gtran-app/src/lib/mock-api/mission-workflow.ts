import { buildRoute } from "@/lib/geo/cities"
import type { AppStore, Invoice, Message, Mission } from "@/types/entities"
import type { MissionStatus } from "@/types/shared"
import { uid } from "./store"
import { computeAlerts } from "./alerts-engine"

export interface MissionCreateInput {
  client: string
  depart: string
  destination: string
  marchandise: string
  poids: string
  driverId?: string
  vehicleId?: string
  prix: number
  cout: number
  agenceId: string
  statut?: MissionStatus
}

export interface MissionTransitionResult {
  mission: Mission
  invoice?: Invoice
  message?: Message
}

const ACTIVE_MISSION_STATUSES: MissionStatus[] = ["planifiee", "en_cours", "en_retard"]
const LOCKED_RESOURCE_STATUSES: MissionStatus[] = ["planifiee", "en_cours", "en_retard"]

function isDriverBusy(store: AppStore, driverId: string, excludeMissionId?: string): boolean {
  return store.missions.some(
    (m) =>
      m.driverId === driverId &&
      ACTIVE_MISSION_STATUSES.includes(m.statut) &&
      m.id !== excludeMissionId
  )
}

function isVehicleBusy(store: AppStore, vehicleId: string, excludeMissionId?: string): boolean {
  return store.missions.some(
    (m) =>
      m.vehicleId === vehicleId &&
      ACTIVE_MISSION_STATUSES.includes(m.statut) &&
      m.id !== excludeMissionId
  )
}

function pickAvailableDriver(store: AppStore, agenceId: string): string | null {
  const driver = store.drivers.find(
    (d) => d.agenceId === agenceId && d.statut === "disponible" && !isDriverBusy(store, d.id)
  )
  return driver?.id ?? null
}

function pickAvailableVehicle(store: AppStore, agenceId: string): string | null {
  const vehicle = store.vehicles.find(
    (v) =>
      v.agenceId === agenceId &&
      v.statut === "disponible" &&
      !isVehicleBusy(store, v.id)
  )
  return vehicle?.id ?? null
}

function resolveDriver(store: AppStore, driverId: string) {
  const driver = store.drivers.find((d) => d.id === driverId)
  if (!driver) throw new Error("Chauffeur introuvable")
  return driver
}

function resolveVehicle(store: AppStore, vehicleId: string) {
  const vehicle = store.vehicles.find((v) => v.id === vehicleId)
  if (!vehicle) throw new Error("Véhicule introuvable")
  return vehicle
}

function syncResourceLocks(store: AppStore): AppStore {
  const lockedDriverIds = new Set<string>()
  const lockedVehicleIds = new Set<string>()

  for (const m of store.missions) {
    if (LOCKED_RESOURCE_STATUSES.includes(m.statut)) {
      lockedDriverIds.add(m.driverId)
      lockedVehicleIds.add(m.vehicleId)
    }
  }

  const drivers = store.drivers.map((d) => {
    if (lockedDriverIds.has(d.id)) return { ...d, statut: "en_mission" }
    if (d.statut === "en_mission") return { ...d, statut: "disponible" }
    return d
  })

  const vehicles = store.vehicles.map((v) => {
    if (lockedVehicleIds.has(v.id)) {
      const mission = store.missions.find(
        (m) => m.vehicleId === v.id && LOCKED_RESOURCE_STATUSES.includes(m.statut)
      )
      const driver = mission ? store.drivers.find((d) => d.id === mission.driverId) : null
      return {
        ...v,
        statut: "en_mission" as const,
        chauffeur: driver?.nom ?? v.chauffeur,
        driverId: mission?.driverId ?? v.driverId,
        disponibilite: 0,
      }
    }
    if (v.statut === "en_mission") {
      return { ...v, statut: "disponible" as const, chauffeur: null, driverId: null, disponibilite: 100 }
    }
    return v
  })

  return { ...store, drivers, vehicles, alerts: computeAlerts({ ...store, drivers, vehicles }) }
}

export function createMissionInStore(store: AppStore, input: MissionCreateInput): AppStore {
  const driverId = input.driverId ?? pickAvailableDriver(store, input.agenceId)
  const vehicleId = input.vehicleId ?? pickAvailableVehicle(store, input.agenceId)

  if (!driverId) throw new Error("Aucun chauffeur disponible")
  if (!vehicleId) throw new Error("Aucun véhicule disponible")
  if (isDriverBusy(store, driverId)) throw new Error("Chauffeur déjà assigné à une mission active")
  if (isVehicleBusy(store, vehicleId)) throw new Error("Véhicule déjà assigné à une mission active")

  const driver = resolveDriver(store, driverId)
  const vehicle = resolveVehicle(store, vehicleId)

  if (vehicle.statut !== "disponible" && vehicle.statut !== "en_mission") {
    throw new Error(`Véhicule ${vehicle.immatriculation} indisponible (${vehicle.statut})`)
  }
  if (driver.statut !== "disponible" && driver.statut !== "en_mission") {
    throw new Error(`Chauffeur ${driver.nom} indisponible (${driver.statut})`)
  }

  const route = buildRoute(input.depart, input.destination)
  const mission: Mission = {
    id: uid("M"),
    client: input.client,
    depart: input.depart,
    destination: input.destination,
    marchandise: input.marchandise,
    poids: input.poids,
    driverId,
    vehicleId,
    chauffeur: driver.nom,
    vehicule: vehicle.immatriculation,
    statut: input.statut ?? "planifiee",
    prix: input.prix,
    cout: input.cout,
    agenceId: input.agenceId,
    route,
    progress: 0,
    createdAt: new Date().toISOString(),
  }

  const messages: Message[] = [
    ...store.messages,
    {
      id: uid("msg"),
      from: "Système",
      subject: `Mission ${mission.id} créée`,
      body: `${mission.client} — ${mission.depart} → ${mission.destination}. Chauffeur ${driver.nom}, véhicule ${vehicle.immatriculation}.`,
      time: "À l'instant",
      unread: true,
      agenceId: input.agenceId,
    },
  ]

  return syncResourceLocks({
    ...store,
    missions: [...store.missions, mission],
    messages,
  })
}

export function transitionMissionInStore(
  store: AppStore,
  missionId: string,
  nextStatus: MissionStatus
): { store: AppStore; result: MissionTransitionResult } {
  const mission = store.missions.find((m) => m.id === missionId)
  if (!mission) throw new Error("Mission introuvable")

  const valid: Record<MissionStatus, MissionStatus[]> = {
    planifiee: ["en_cours", "annulee"],
    en_cours: ["livree", "en_retard", "annulee"],
    en_retard: ["livree", "en_cours", "annulee"],
    livree: [],
    annulee: [],
  }

  if (!valid[mission.statut].includes(nextStatus)) {
    throw new Error(`Transition ${mission.statut} → ${nextStatus} non autorisée`)
  }

  let progress = mission.progress
  if (nextStatus === "en_cours") progress = 0.15
  if (nextStatus === "en_retard") progress = Math.max(progress, 0.72)
  if (nextStatus === "livree") progress = 1
  if (nextStatus === "annulee") progress = 0

  let missions = store.missions.map((m) =>
    m.id === missionId ? { ...m, statut: nextStatus, progress } : m
  )
  let invoices = store.invoices
  let messages = store.messages
  let documents = store.documents
  let invoice: Invoice | undefined
  let message: Message | undefined

  if (nextStatus === "livree") {
    const due = new Date()
    due.setDate(due.getDate() + 30)
    invoice = {
      id: uid("F"),
      client: mission.client,
      montant: mission.prix,
      echeance: due.toISOString().slice(0, 10),
      statut: "en_attente",
      agenceId: mission.agenceId,
      missionId: mission.id,
    }
    invoices = [...invoices, invoice]

    documents = [
      ...documents,
      {
        id: uid("doc"),
        type: "Bon de livraison",
        entite: mission.id,
        expiration: due.toISOString().slice(0, 10),
        statut: "valide",
        agenceId: mission.agenceId,
        missionId: mission.id,
      },
    ]

    message = {
      id: uid("msg"),
      from: "Système",
      subject: `Livraison confirmée — ${mission.id}`,
      body: `Mission ${mission.id} livrée. Facture ${invoice.id} générée pour ${mission.client} (${mission.prix.toLocaleString("fr-FR")} XOF).`,
      time: "À l'instant",
      unread: true,
      agenceId: mission.agenceId,
    }
    messages = [...messages, message]
  }

  if (nextStatus === "annulee") {
    message = {
      id: uid("msg"),
      from: "Système",
      subject: `Mission annulée — ${mission.id}`,
      body: `La mission ${mission.id} (${mission.depart} → ${mission.destination}) a été annulée. Véhicule et chauffeur libérés.`,
      time: "À l'instant",
      unread: true,
      agenceId: mission.agenceId,
    }
    messages = [...messages, message]
  }

  if (nextStatus === "en_cours") {
    message = {
      id: uid("msg"),
      from: "Système",
      subject: `Mission démarrée — ${mission.id}`,
      body: `${mission.chauffeur} a pris la route avec ${mission.vehicule} (${mission.depart} → ${mission.destination}).`,
      time: "À l'instant",
      unread: true,
      agenceId: mission.agenceId,
    }
    messages = [...messages, message]
  }

  const nextStore = syncResourceLocks({
    ...store,
    missions,
    invoices,
    messages,
    documents,
  })

  const updatedMission = nextStore.missions.find((m) => m.id === missionId)!
  return { store: nextStore, result: { mission: updatedMission, invoice, message } }
}

export function deleteMissionInStore(store: AppStore, missionId: string): AppStore {
  const mission = store.missions.find((m) => m.id === missionId)
  if (!mission) return store
  if (mission.statut === "en_cours" || mission.statut === "en_retard") {
    throw new Error("Impossible de supprimer une mission en cours — annulez-la d'abord")
  }
  return syncResourceLocks({
    ...store,
    missions: store.missions.filter((m) => m.id !== missionId),
  })
}

export function refreshStoreAlerts(store: AppStore): AppStore {
  return { ...store, alerts: computeAlerts(store) }
}
