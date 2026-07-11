import { apiClient } from "./client"
import type {
  AgenceDetail,
  Alert,
  Document,
  Driver,
  Employee,
  FuelRecord,
  Invoice,
  MaintenanceItem,
  Message,
  Mission,
  Payment,
  TrackingVehicle,
  Vehicle,
} from "@/types/entities"
import type { MissionStatus } from "@/types/shared"
import type { User } from "@/types/shared"

interface AuthResponse {
  access_token: string
  token_type: string
  user: User & { entrepriseId: string }
}

interface MissionCreateInput {
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

interface MissionTransitionResult {
  mission: Mission
  invoice?: Invoice
  message?: Message
}

function qs(agenceId?: string, extra?: Record<string, string>) {
  const params = new URLSearchParams()
  if (agenceId) params.set("agenceId", agenceId)
  if (extra) Object.entries(extra).forEach(([k, v]) => params.set(k, v))
  const s = params.toString()
  return s ? `?${s}` : ""
}

// Auth
export async function loginAccount(email: string, password: string) {
  const res = await apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  return res
}

export async function registerAccount(data: { nom: string; email: string; password: string }) {
  return apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateAccount(patch: Partial<Pick<User, "nom" | "email">>) {
  return apiClient<User & { entrepriseId: string }>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(patch),
  })
}

// Vehicles
export const fetchVehicles = (agenceId?: string) => apiClient<Vehicle[]>(`/vehicles${qs(agenceId)}`)
export const createVehicle = (data: Omit<Vehicle, "id">) =>
  apiClient<Vehicle>("/vehicles", { method: "POST", body: JSON.stringify(data) })
export const updateVehicle = (id: string, patch: Partial<Vehicle>) =>
  apiClient<Vehicle>(`/vehicles/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
export const deleteVehicle = (id: string) => apiClient<void>(`/vehicles/${id}`, { method: "DELETE" })

// Drivers
export const fetchDrivers = (agenceId?: string) => apiClient<Driver[]>(`/drivers${qs(agenceId)}`)
export const createDriver = (data: Omit<Driver, "id">) =>
  apiClient<Driver>("/drivers", { method: "POST", body: JSON.stringify(data) })
export const updateDriver = (id: string, patch: Partial<Driver>) =>
  apiClient<Driver>(`/drivers/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
export const deleteDriver = (id: string) => apiClient<void>(`/drivers/${id}`, { method: "DELETE" })

// Missions
export const fetchMissions = (agenceId?: string) => apiClient<Mission[]>(`/missions${qs(agenceId)}`)
export const createMission = (data: MissionCreateInput) =>
  apiClient<Mission>("/missions", { method: "POST", body: JSON.stringify(data) })
export const transitionMission = (id: string, statut: MissionStatus) =>
  apiClient<MissionTransitionResult>(`/missions/${id}/transition`, {
    method: "POST",
    body: JSON.stringify({ statut }),
  })
export const updateMission = (id: string, patch: Partial<Mission>) =>
  apiClient<Mission>(`/missions/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
export const deleteMission = (id: string) => apiClient<void>(`/missions/${id}`, { method: "DELETE" })

// Documents
export const fetchDocuments = (agenceId?: string) => apiClient<Document[]>(`/documents${qs(agenceId)}`)
export const createDocument = (data: Omit<Document, "id">) =>
  apiClient<Document>("/documents", { method: "POST", body: JSON.stringify(data) })
export const deleteDocument = (id: string) => apiClient<void>(`/documents/${id}`, { method: "DELETE" })

// Invoices
export const fetchInvoices = (agenceId?: string) => apiClient<Invoice[]>(`/invoices${qs(agenceId)}`)
export const createInvoice = (data: Omit<Invoice, "id">) =>
  apiClient<Invoice>("/invoices", { method: "POST", body: JSON.stringify(data) })
export const updateInvoice = (id: string, patch: Partial<Invoice>) =>
  apiClient<Invoice>(`/invoices/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
export const sendInvoiceReminder = (invoiceId: string, agenceId: string) =>
  apiClient<Message>(`/invoices/${invoiceId}/remind${qs(agenceId)}`, { method: "POST" })

// Payments
export const fetchPayments = (agenceId?: string) => apiClient<Payment[]>(`/payments${qs(agenceId)}`)
export const createPayment = (data: Omit<Payment, "id">) =>
  apiClient<Payment>("/payments", { method: "POST", body: JSON.stringify(data) })
export const releaseEscrow = (paymentId: string) =>
  apiClient<Payment>(`/payments/${paymentId}/release-escrow`, { method: "POST" })
export const getPaymentGatewayStatus = () => apiClient<Record<string, boolean>>("/payment-gateways")
export const testPaymentGateway = (method: string) =>
  apiClient<{ method: string; connected: boolean }>(`/payment-gateways/${encodeURIComponent(method)}/test`, {
    method: "POST",
  })

// Maintenance
export const fetchMaintenance = (agenceId?: string) => apiClient<MaintenanceItem[]>(`/maintenance${qs(agenceId)}`)
export const createMaintenance = (data: Omit<MaintenanceItem, "id" | "vehicleId"> & { vehicleId?: string }) =>
  apiClient<MaintenanceItem>("/maintenance", { method: "POST", body: JSON.stringify(data) })
export const updateMaintenance = (id: string, patch: Partial<MaintenanceItem>) =>
  apiClient<MaintenanceItem>(`/maintenance/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
export const deleteMaintenance = (id: string) => apiClient<void>(`/maintenance/${id}`, { method: "DELETE" })

// Fuel
export const fetchFuelRecords = (agenceId?: string) => apiClient<FuelRecord[]>(`/fuel-records${qs(agenceId)}`)
export const createFuelRecord = (data: Omit<FuelRecord, "id" | "vehicleId"> & { vehicleId?: string }) =>
  apiClient<FuelRecord>("/fuel-records", { method: "POST", body: JSON.stringify(data) })

// Employees
export const fetchEmployees = (agenceId?: string) => apiClient<Employee[]>(`/employees${qs(agenceId)}`)
export const createEmployee = (data: Omit<Employee, "id">) =>
  apiClient<Employee>("/employees", { method: "POST", body: JSON.stringify(data) })
export const updateEmployee = (id: string, patch: Partial<Employee>) =>
  apiClient<Employee>(`/employees/${id}`, { method: "PATCH", body: JSON.stringify(patch) })

// Messages
export const fetchMessages = (agenceId?: string) => apiClient<Message[]>(`/messages${qs(agenceId)}`)
export const sendMessage = (data: Omit<Message, "id">) =>
  apiClient<Message>("/messages", { method: "POST", body: JSON.stringify(data) })
export const markMessageRead = (id: string) => apiClient<Message>(`/messages/${id}/read`, { method: "PATCH" })

// Derived
export const fetchAlerts = (agenceId?: string) => apiClient<Alert[]>(`/alerts${qs(agenceId)}`)
export const fetchTracking = (agenceId?: string) => apiClient<TrackingVehicle[]>(`/tracking${qs(agenceId)}`)
export const fetchAgences = () => apiClient<AgenceDetail[]>("/agences")
export const searchGlobal = (query: string, agenceId?: string) =>
  apiClient<{ missions: Mission[]; vehicles: Vehicle[]; drivers: Driver[] }>(
    `/search${qs(agenceId, { q: query })}`
  )

// AI
export const queryAiAssist = (query: string, agenceId?: string) =>
  apiClient<{ answer: string }>("/ai-assist/query", {
    method: "POST",
    body: JSON.stringify({ query, agence_id: agenceId }),
  })

export type { MissionCreateInput, MissionTransitionResult }
