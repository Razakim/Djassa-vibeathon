export const APP_NAME = "Gtran"
export const DEFAULT_CURRENCY = "XOF"

export const MOBILE_ROLES = ["chauffeur", "gestionnaire", "admin"] as const
export type MobileRole = (typeof MOBILE_ROLES)[number]
