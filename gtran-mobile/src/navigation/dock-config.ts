import type { DockItem } from "@/design-system"

export const CHAUFFEUR_DOCK: DockItem[] = [
  { key: "home", label: "Terrain", href: "/(chauffeur)", icon: "◎" },
  { key: "courses", label: "Courses", href: "/(chauffeur)/courses", icon: "▣" },
  { key: "gps", label: "GPS", href: "/(chauffeur)/gps", icon: "⬡", prominent: true },
  { key: "messages", label: "Radio", href: "/(chauffeur)/messages", icon: "◈" },
  { key: "compte", label: "Moi", href: "/(chauffeur)/compte", icon: "○" },
]

export const EXPLOITANT_DOCK: DockItem[] = [
  { key: "pulse", label: "Pulse", href: "/(exploitant)", icon: "◎" },
  { key: "flotte", label: "Flotte", href: "/(exploitant)/flotte", icon: "▣" },
  { key: "alertes", label: "Alertes", href: "/(exploitant)/alertes", icon: "!", prominent: true },
  { key: "missions", label: "Missions", href: "/(exploitant)/missions", icon: "◈" },
  { key: "compte", label: "Moi", href: "/(exploitant)/compte", icon: "○" },
]
