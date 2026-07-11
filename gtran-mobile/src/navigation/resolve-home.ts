import type { AuthUser } from "@/lib/auth"

export type Persona = "chauffeur" | "exploitant"

export function resolvePersona(user: AuthUser | null): Persona | null {
  if (!user) return null
  if (user.role === "chauffeur") return "chauffeur"
  return "exploitant"
}

export function resolveHomeRoute(persona: Persona | null): string {
  if (persona === "chauffeur") return "/(chauffeur)"
  if (persona === "exploitant") return "/(exploitant)"
  return "/(onboarding)/login"
}
