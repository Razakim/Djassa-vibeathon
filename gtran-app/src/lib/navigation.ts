import {
  BarChart3,
  Bot,
  Building2,
  CreditCard,
  FileText,
  Fuel,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Receipt,
  Route,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  group?: string
}

export const navItems: NavItem[] = [
  { title: "Tableau de bord", href: "/", icon: LayoutDashboard, group: "Principal" },
  { title: "Entreprises", href: "/companies", icon: Building2, group: "Organisation" },
  { title: "Flotte", href: "/fleet", icon: Truck, group: "Opérations" },
  { title: "Chauffeurs", href: "/drivers", icon: Users, group: "Opérations" },
  { title: "Missions", href: "/missions", icon: Route, group: "Opérations" },
  { title: "Suivi GPS", href: "/tracking", icon: MapPin, group: "Opérations" },
  { title: "Documents", href: "/documents", icon: FileText, group: "Conformité" },
  { title: "Comptabilité", href: "/accounting", icon: BarChart3, group: "Finance" },
  { title: "Facturation", href: "/billing", icon: Receipt, group: "Finance" },
  { title: "Paiements", href: "/payments", icon: CreditCard, group: "Finance" },
  { title: "Maintenance", href: "/maintenance", icon: Wrench, group: "Flotte" },
  { title: "Carburant", href: "/fuel", icon: Fuel, group: "Flotte" },
  { title: "Analyses", href: "/analytics", icon: BarChart3, group: "Pilotage" },
  { title: "RH", href: "/hr", icon: Users, group: "Organisation" },
  { title: "Communication", href: "/communication", icon: MessageSquare, group: "Organisation" },
  { title: "Assistant IA", href: "/ai-assist", icon: Bot, group: "Pilotage" },
]

export const navGroups = [...new Set(navItems.map((item) => item.group).filter(Boolean))] as string[]
