import { uid, simulateDelay, getStore, updateStore } from "./store"
import { computeAlerts } from "./alerts-engine"
import {
  createMissionInStore,
  deleteMissionInStore,
  transitionMissionInStore,
  refreshStoreAlerts,
  type MissionCreateInput,
} from "./mission-workflow"
import { deriveTracking } from "./tracking"
import { processInvoiceReminders } from "./invoice-reminders"
import type {
  AppStore,
  AuthAccount,
  Document,
  Driver,
  Employee,
  FuelRecord,
  Invoice,
  MaintenanceItem,
  Message,
  Mission,
  Payment,
  Vehicle,
} from "@/types/entities"
import type { MissionStatus, PaymentStatus, VehicleStatus } from "@/types/shared"

type CollectionKey = {
  vehicles: Vehicle
  drivers: Driver
  missions: Mission
  documents: Document
  invoices: Invoice
  payments: Payment
  maintenanceItems: MaintenanceItem
  fuelRecords: FuelRecord
  employees: Employee
  messages: Message
}

function withFreshAlerts(store: AppStore): AppStore {
  return refreshStoreAlerts(store)
}

async function list<K extends keyof CollectionKey>(key: K, agenceId?: string): Promise<CollectionKey[K][]> {
  await simulateDelay()
  const items = getStore()[key] as CollectionKey[K][]
  if (!agenceId) return items
  return items.filter((item) => (item as { agenceId: string }).agenceId === agenceId)
}

async function create<K extends keyof CollectionKey>(
  key: K,
  item: Omit<CollectionKey[K], "id"> & { id?: string }
): Promise<CollectionKey[K]> {
  await simulateDelay()
  const entry = { ...item, id: item.id ?? uid(String(key)) } as CollectionKey[K]
  updateStore((store) =>
    withFreshAlerts({
      ...store,
      [key]: [...(store[key] as CollectionKey[K][]), entry],
    })
  )
  return entry
}

async function update<K extends keyof CollectionKey>(
  key: K,
  id: string,
  patch: Partial<CollectionKey[K]>
): Promise<CollectionKey[K]> {
  await simulateDelay()
  let updated!: CollectionKey[K]
  updateStore((store) => {
    const items = (store[key] as CollectionKey[K][]).map((item) => {
      if (item.id !== id) return item
      updated = { ...item, ...patch }
      return updated
    })
    return withFreshAlerts({ ...store, [key]: items })
  })
  return updated
}

async function remove<K extends keyof CollectionKey>(key: K, id: string) {
  await simulateDelay()
  updateStore((store) =>
    withFreshAlerts({
      ...store,
      [key]: (store[key] as CollectionKey[K][]).filter((item) => item.id !== id),
    })
  )
}

// Vehicles
export const fetchVehicles = (agenceId?: string) => list("vehicles", agenceId)
export const createVehicle = (data: Omit<Vehicle, "id">) => create("vehicles", data)
export const updateVehicle = (id: string, patch: Partial<Vehicle>) => update("vehicles", id, patch)
export const deleteVehicle = (id: string) => remove("vehicles", id)

// Drivers
export const fetchDrivers = (agenceId?: string) => list("drivers", agenceId)
export const createDriver = (data: Omit<Driver, "id">) => create("drivers", data)
export const updateDriver = (id: string, patch: Partial<Driver>) => update("drivers", id, patch)
export const deleteDriver = (id: string) => remove("drivers", id)

// Missions — workflow métier
export const fetchMissions = (agenceId?: string) => list("missions", agenceId)

export async function createMission(data: Omit<MissionCreateInput, "agenceId"> & { agenceId: string }) {
  await simulateDelay()
  let created!: Mission
  updateStore((store) => {
    const next = createMissionInStore(store, data)
    created = next.missions[next.missions.length - 1]
    return next
  })
  return created
}

export async function transitionMission(id: string, statut: MissionStatus) {
  await simulateDelay()
  let result!: ReturnType<typeof transitionMissionInStore>["result"]
  updateStore((store) => {
    const { store: next, result: r } = transitionMissionInStore(store, id, statut)
    result = r
    return next
  })
  return result
}

export const updateMission = (id: string, patch: Partial<Mission>) => update("missions", id, patch)

export async function deleteMission(id: string) {
  await simulateDelay()
  updateStore((store) => deleteMissionInStore(store, id))
}

// Documents
export const fetchDocuments = (agenceId?: string) => list("documents", agenceId)
export const createDocument = (data: Omit<Document, "id">) => create("documents", data)
export const deleteDocument = (id: string) => remove("documents", id)

// Invoices
export async function fetchInvoices(agenceId?: string) {
  await simulateDelay()
  updateStore(processInvoiceReminders)
  return list("invoices", agenceId)
}
export const createInvoice = (data: Omit<Invoice, "id">) => create("invoices", data)
export const updateInvoice = (id: string, patch: Partial<Invoice>) => update("invoices", id, patch)

// Payments
export const fetchPayments = (agenceId?: string) => list("payments", agenceId)
export const createPayment = (data: Omit<Payment, "id">) => create("payments", data)
export const updatePayment = (id: string, patch: Partial<Payment>) => update("payments", id, patch)

// Maintenance
export const fetchMaintenance = (agenceId?: string) => list("maintenanceItems", agenceId)
export const createMaintenance = async (data: Omit<MaintenanceItem, "id" | "vehicleId"> & { vehicleId?: string }) => {
  const store = getStore()
  const vehicleId = data.vehicleId ?? store.vehicles.find((v) => v.immatriculation === data.vehicule)?.id ?? uid("v")
  return create("maintenanceItems", { ...data, vehicleId })
}
export const updateMaintenance = (id: string, patch: Partial<MaintenanceItem>) =>
  update("maintenanceItems", id, patch)
export const deleteMaintenance = (id: string) => remove("maintenanceItems", id)

// Fuel
export const fetchFuelRecords = (agenceId?: string) => list("fuelRecords", agenceId)
export const createFuelRecord = async (data: Omit<FuelRecord, "id" | "vehicleId"> & { vehicleId?: string }) => {
  const store = getStore()
  const vehicleId = data.vehicleId ?? store.vehicles.find((v) => v.immatriculation === data.vehicule)?.id ?? uid("v")
  return create("fuelRecords", { ...data, vehicleId })
}

// Employees
export const fetchEmployees = (agenceId?: string) => list("employees", agenceId)
export const createEmployee = (data: Omit<Employee, "id">) => create("employees", data)
export const updateEmployee = (id: string, patch: Partial<Employee>) => update("employees", id, patch)

// Messages
export const fetchMessages = (agenceId?: string) => list("messages", agenceId)
export const sendMessage = (data: Omit<Message, "id">) => create("messages", data)
export const markMessageRead = (id: string) => update("messages", id, { unread: false } as Partial<Message>)

// Dashboard / misc
export async function fetchAlerts(agenceId?: string) {
  await simulateDelay()
  updateStore(processInvoiceReminders)
  const store = getStore()
  return agenceId ? computeAlerts(store, agenceId) : computeAlerts(store)
}

export async function fetchTracking(agenceId?: string) {
  await simulateDelay()
  return deriveTracking(getStore(), agenceId)
}

export async function fetchAgences() {
  await simulateDelay()
  return getStore().agences
}

export async function fetchAccounts(): Promise<AuthAccount[]> {
  await simulateDelay(100)
  return getStore().accounts
}

export async function registerAccount(data: Omit<AuthAccount, "id">) {
  await simulateDelay()
  const store = getStore()
  if (store.accounts.some((a) => a.email === data.email)) {
    throw new Error("Cet email est déjà utilisé")
  }
  const account: AuthAccount = { ...data, id: uid("u") }
  updateStore((s) => ({ ...s, accounts: [...s.accounts, account] }))
  return account
}

export async function loginAccount(email: string, password: string) {
  await simulateDelay(400)
  const account = getStore().accounts.find((a) => a.email === email && a.password === password)
  if (!account) throw new Error("Email ou mot de passe incorrect")
  return account
}

export async function updateAccount(id: string, patch: Partial<Pick<AuthAccount, "nom" | "email">>) {
  await simulateDelay()
  let updated!: AuthAccount
  updateStore((store) => {
    const accounts = store.accounts.map((a) => {
      if (a.id !== id) return a
      updated = { ...a, ...patch }
      return updated
    })
    return { ...store, accounts }
  })
  return updated
}

export async function releaseEscrow(paymentId: string) {
  return updatePayment(paymentId, { statut: "paye" })
}

export async function sendInvoiceReminder(invoiceId: string, agenceId: string) {
  await simulateDelay()
  const store = getStore()
  const invoice = store.invoices.find((i) => i.id === invoiceId)
  if (!invoice) throw new Error("Facture introuvable")
  const today = new Date().toISOString().slice(0, 10)
  updateStore((s) => ({
    ...s,
    invoices: s.invoices.map((i) =>
      i.id === invoiceId ? { ...i, lastReminderAt: today } : i
    ),
  }))
  return sendMessage({
    from: "Système",
    subject: `Relance paiement — ${invoice.id}`,
    body: `Relance envoyée à ${invoice.client} pour un montant de ${invoice.montant.toLocaleString("fr-FR")} XOF.`,
    time: "À l'instant",
    unread: true,
    agenceId,
  })
}

const GATEWAY_KEY = "gtran-gateways"

export async function testPaymentGateway(method: string) {
  await simulateDelay(600)
  const raw = localStorage.getItem(GATEWAY_KEY)
  const status = raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  status[method] = true
  localStorage.setItem(GATEWAY_KEY, JSON.stringify(status))
  return { method, connected: true }
}

export async function getPaymentGatewayStatus() {
  await simulateDelay(100)
  const raw = localStorage.getItem(GATEWAY_KEY)
  return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
}

export async function searchGlobal(query: string, agenceId?: string) {
  await simulateDelay(200)
  const q = query.toLowerCase()
  const store = getStore()
  const filterAgence = <T extends { agenceId: string }>(items: T[]) =>
    agenceId ? items.filter((i) => i.agenceId === agenceId) : items

  return {
    missions: filterAgence(store.missions).filter(
      (m) => m.id.toLowerCase().includes(q) || m.client.toLowerCase().includes(q)
    ),
    vehicles: filterAgence(store.vehicles).filter(
      (v) => v.immatriculation.toLowerCase().includes(q) || (v.chauffeur ?? "").toLowerCase().includes(q)
    ),
    drivers: filterAgence(store.drivers).filter((d) => d.nom.toLowerCase().includes(q)),
  }
}

export type { AppStore, MissionStatus, PaymentStatus, VehicleStatus, MissionCreateInput }
