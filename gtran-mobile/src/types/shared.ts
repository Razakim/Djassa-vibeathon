export interface TenantScope {
  entrepriseId: string
  agenceId: string
}

export type MissionStatus = "planifiee" | "en_cours" | "en_retard" | "livree" | "annulee"
export type VehicleStatus = "disponible" | "en_mission" | "maintenance" | "immobilise"
export type PaymentStatus = "paye" | "partiel" | "en_attente" | "en_retard"

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
