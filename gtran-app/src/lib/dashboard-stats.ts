import type { FuelRecord, Mission } from "@/types/entities"

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"]

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function isInMonth(isoDate: string | undefined, key: string): boolean {
  if (!isoDate) return key === monthKey(new Date())
  return isoDate.slice(0, 7) === key
}

export interface ChartMonth {
  mois: string
  revenus: number
  depenses: number
}

export function buildRevenueChart(missions: Mission[], fuel: FuelRecord[]): ChartMonth[] {
  const now = new Date()
  const chart: ChartMonth[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = monthKey(d)
    const livrees = missions.filter((m) => m.statut === "livree" && isInMonth(m.createdAt, key))
    const revenus = livrees.reduce((s, m) => s + m.prix, 0) / 1_000_000
    const coutMissions = livrees.reduce((s, m) => s + m.cout, 0)
    const coutCarburant = fuel.filter((f) => isInMonth(f.date, key)).reduce((s, f) => s + f.montant, 0)
    const depenses = (coutMissions + coutCarburant) / 1_000_000

    chart.push({
      mois: MONTHS_FR[d.getMonth()],
      revenus: Math.round(revenus * 10) / 10,
      depenses: Math.round(depenses * 10) / 10,
    })
  }

  return chart
}

export function getCurrentMonthKey(): string {
  return monthKey(new Date())
}

export function sumLivreesThisMonth(missions: Mission[]) {
  const key = getCurrentMonthKey()
  const livrees = missions.filter((m) => m.statut === "livree" && isInMonth(m.createdAt, key))
  return {
    revenus: livrees.reduce((s, m) => s + m.prix, 0),
    depenses: livrees.reduce((s, m) => s + m.cout, 0),
    count: livrees.length,
  }
}

export function sumFuelThisMonth(fuel: FuelRecord[]) {
  const key = getCurrentMonthKey()
  return fuel.filter((f) => isInMonth(f.date, key)).reduce((s, f) => s + f.montant, 0)
}

export function countExpiringDocuments(
  documents: { expiration: string; statut: string }[]
): number {
  const now = Date.now()
  return documents.filter((d) => {
    const days = Math.ceil((new Date(d.expiration).getTime() - now) / 86_400_000)
    return days <= 30 && days >= 0
  }).length
}
