import type { AppStore } from "@/types/entities"
import { createSeedStore } from "./seed"

const STORAGE_KEY = "gtran-store-v2"

export function getStore(): AppStore {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seed = createSeedStore()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
  return JSON.parse(raw) as AppStore
}

export function saveStore(store: AppStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  window.dispatchEvent(new CustomEvent("gtran-store-updated"))
}

export function resetStore() {
  const seed = createSeedStore()
  saveStore(seed)
  return seed
}

export function updateStore(updater: (store: AppStore) => AppStore) {
  const next = updater(getStore())
  saveStore(next)
  return next
}

export function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`
}

export async function simulateDelay(ms = 300) {
  await new Promise((r) => setTimeout(r, ms))
}
