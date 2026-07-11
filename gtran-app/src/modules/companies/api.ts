import { agences } from "@/lib/mock-data"
import type { AgenceDetail } from "./types"

export async function fetchAgences(): Promise<AgenceDetail[]> {
  return agences
}
