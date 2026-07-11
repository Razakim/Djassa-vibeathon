import { Badge } from "@/components/ui/badge"
import type { MissionStatus, PaymentStatus, VehicleStatus } from "@/types/shared"

const missionLabels: Record<MissionStatus, string> = {
  planifiee: "Planifiée",
  en_cours: "En cours",
  en_retard: "En retard",
  livree: "Livrée",
  annulee: "Annulée",
}

const missionVariants: Record<MissionStatus, "info" | "warning" | "destructive" | "success" | "secondary"> = {
  planifiee: "secondary",
  en_cours: "info",
  en_retard: "destructive",
  livree: "success",
  annulee: "secondary",
}

const vehicleLabels: Record<VehicleStatus, string> = {
  disponible: "Disponible",
  en_mission: "En mission",
  maintenance: "Maintenance",
  immobilise: "Immobilisé",
}

const vehicleVariants: Record<VehicleStatus, "success" | "info" | "warning" | "destructive"> = {
  disponible: "success",
  en_mission: "info",
  maintenance: "warning",
  immobilise: "destructive",
}

const paymentLabels: Record<PaymentStatus, string> = {
  paye: "Payé",
  partiel: "Partiel",
  en_attente: "En attente",
  en_retard: "En retard",
}

const paymentVariants: Record<PaymentStatus, "success" | "warning" | "secondary" | "destructive"> = {
  paye: "success",
  partiel: "warning",
  en_attente: "secondary",
  en_retard: "destructive",
}

export function MissionStatusBadge({ status, className }: { status: MissionStatus; className?: string }) {
  return (
    <Badge variant={missionVariants[status]} className={className}>
      {missionLabels[status]}
    </Badge>
  )
}

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return <Badge variant={vehicleVariants[status]}>{vehicleLabels[status]}</Badge>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={paymentVariants[status]}>{paymentLabels[status]}</Badge>
}
