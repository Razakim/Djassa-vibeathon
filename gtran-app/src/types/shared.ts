export interface TenantScope {
  entrepriseId: string
  agenceId: string
}

export interface Entreprise {
  id: string
  nom: string
  devise: string
}

export interface Agence {
  id: string
  entrepriseId: string
  nom: string
  ville: string
}

export interface User {
  id: string
  nom: string
  email: string
  role: string
  avatar?: string
}

export type MissionStatus = "planifiee" | "en_cours" | "en_retard" | "livree" | "annulee"
export type VehicleStatus = "disponible" | "en_mission" | "maintenance" | "immobilise"
export type PaymentStatus = "paye" | "partiel" | "en_attente" | "en_retard"

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
