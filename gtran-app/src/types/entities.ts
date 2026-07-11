import type { MissionStatus, PaymentStatus, VehicleStatus } from "./shared"
import type { LatLng } from "@/lib/geo/cities"

export interface Vehicle {
  id: string
  immatriculation: string
  type: string
  statut: VehicleStatus
  driverId: string | null
  chauffeur: string | null
  km: number
  conso: number
  disponibilite: number
  agenceId: string
  position?: LatLng
}

export interface Driver {
  id: string
  nom: string
  permis: string
  categorie: string
  ponctualite: number
  km: number
  accidents: number
  statut: string
  agenceId: string
}

export interface Mission {
  id: string
  client: string
  depart: string
  destination: string
  marchandise: string
  poids: string
  driverId: string
  vehicleId: string
  chauffeur: string
  vehicule: string
  statut: MissionStatus
  prix: number
  cout: number
  agenceId: string
  route: LatLng[]
  progress: number
  createdAt?: string
}

export interface Document {
  id: string
  type: string
  entite: string
  expiration: string
  statut: string
  agenceId: string
  missionId?: string
  vehicleId?: string
  driverId?: string
}

export interface Invoice {
  id: string
  client: string
  montant: number
  echeance: string
  statut: PaymentStatus
  agenceId: string
  missionId?: string
  lastReminderAt?: string
}

export interface Payment {
  id: string
  reference: string
  client: string
  montant: number
  methode: string
  statut: PaymentStatus
  date: string
  agenceId: string
  invoiceId?: string
}

export interface MaintenanceItem {
  id: string
  vehicleId: string
  vehicule: string
  type: string
  echeance: string
  kmRestant: number
  priorite: string
  agenceId: string
}

export interface FuelRecord {
  id: string
  vehicleId: string
  vehicule: string
  station: string
  litres: number
  montant: number
  conso: number
  anomalie: boolean
  date: string
  agenceId: string
}

export interface Employee {
  id: string
  nom: string
  poste: string
  contrat: string
  conges: number
  statut: string
  agenceId: string
}

export interface Message {
  id: string
  from: string
  subject: string
  body: string
  time: string
  unread: boolean
  agenceId: string
}

export interface Alert {
  id: string
  type: string
  message: string
  severity: "info" | "warning" | "danger"
  agenceId: string
  entityId?: string
  href?: string
}

export interface TrackingVehicle {
  id: string
  immatriculation: string
  chauffeur: string
  vitesse: number
  position: string
  statut: string
  arret: string
  coords: LatLng
  missionId?: string
  vehicleId?: string
  driverId?: string
}

export interface AgenceDetail {
  id: string
  nom: string
  employes: number
  vehicules: number
  ville: string
}

export interface AuthAccount {
  id: string
  nom: string
  email: string
  password: string
  role: string
  entrepriseId: string
}

export interface AppStore {
  vehicles: Vehicle[]
  drivers: Driver[]
  missions: Mission[]
  documents: Document[]
  invoices: Invoice[]
  payments: Payment[]
  maintenanceItems: MaintenanceItem[]
  fuelRecords: FuelRecord[]
  employees: Employee[]
  messages: Message[]
  alerts: Alert[]
  agences: AgenceDetail[]
  accounts: AuthAccount[]
}
