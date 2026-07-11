import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTenant } from "@/lib/tenant"
import * as api from "@/lib/api"
import type { Mission } from "@/types/entities"
import {
  buildRevenueChart,
  countExpiringDocuments,
  sumFuelThisMonth,
  sumLivreesThisMonth,
} from "@/lib/dashboard-stats"

function useAgenceId() {
  const { agenceId } = useTenant()
  return agenceId
}

function useInvalidate() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries()
}

export function useVehicles() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["vehicles", agenceId], queryFn: () => api.fetchVehicles(agenceId) })
}

export function useVehicleMutations() {
  const invalidate = useInvalidate()
  const agenceId = useAgenceId()
  return {
    create: useMutation({
      mutationFn: (data: Omit<Parameters<typeof api.createVehicle>[0], "agenceId">) => api.createVehicle({ ...data, agenceId }),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, ...patch }: { id: string } & Partial<Parameters<typeof api.createVehicle>[0]>) =>
        api.updateVehicle(id, patch),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: api.deleteVehicle, onSuccess: invalidate }),
  }
}

export function useDrivers() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["drivers", agenceId], queryFn: () => api.fetchDrivers(agenceId) })
}

export function useDriverMutations() {
  const invalidate = useInvalidate()
  const agenceId = useAgenceId()
  return {
    create: useMutation({
      mutationFn: (data: Omit<Parameters<typeof api.createDriver>[0], "agenceId">) => api.createDriver({ ...data, agenceId }),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, ...patch }: { id: string } & Partial<Parameters<typeof api.createDriver>[0]>) =>
        api.updateDriver(id, patch),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: api.deleteDriver, onSuccess: invalidate }),
  }
}

export function useMissions() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["missions", agenceId], queryFn: () => api.fetchMissions(agenceId) })
}

export function useMissionMutations() {
  const invalidate = useInvalidate()
  const agenceId = useAgenceId()
  return {
    create: useMutation({
      mutationFn: (data: Omit<Parameters<typeof api.createMission>[0], "agenceId">) =>
        api.createMission({ ...data, agenceId }),
      onSuccess: invalidate,
    }),
    transition: useMutation({
      mutationFn: ({ id, statut }: { id: string; statut: Parameters<typeof api.transitionMission>[1] }) =>
        api.transitionMission(id, statut),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, ...patch }: { id: string } & Partial<Mission>) => api.updateMission(id, patch),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: api.deleteMission, onSuccess: invalidate }),
  }
}

export function useDocuments() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["documents", agenceId], queryFn: () => api.fetchDocuments(agenceId) })
}

export function useDocumentMutations() {
  const invalidate = useInvalidate()
  const agenceId = useAgenceId()
  return {
    create: useMutation({
      mutationFn: (data: Omit<Parameters<typeof api.createDocument>[0], "agenceId">) => api.createDocument({ ...data, agenceId }),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: api.deleteDocument, onSuccess: invalidate }),
  }
}

export function useInvoices() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["invoices", agenceId], queryFn: () => api.fetchInvoices(agenceId) })
}

export function useInvoiceMutations() {
  const invalidate = useInvalidate()
  const agenceId = useAgenceId()
  return {
    create: useMutation({
      mutationFn: (data: Omit<Parameters<typeof api.createInvoice>[0], "agenceId">) => api.createInvoice({ ...data, agenceId }),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, ...patch }: { id: string } & Partial<Parameters<typeof api.createInvoice>[0]>) =>
        api.updateInvoice(id, patch),
      onSuccess: invalidate,
    }),
    sendReminder: useMutation({
      mutationFn: (invoiceId: string) => api.sendInvoiceReminder(invoiceId, agenceId),
      onSuccess: invalidate,
    }),
  }
}

export function usePayments() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["payments", agenceId], queryFn: () => api.fetchPayments(agenceId) })
}

export function usePaymentMutations() {
  const invalidate = useInvalidate()
  const agenceId = useAgenceId()
  return {
    create: useMutation({
      mutationFn: (data: Omit<Parameters<typeof api.createPayment>[0], "agenceId">) => api.createPayment({ ...data, agenceId }),
      onSuccess: invalidate,
    }),
    releaseEscrow: useMutation({ mutationFn: api.releaseEscrow, onSuccess: invalidate }),
    testGateway: useMutation({
      mutationFn: api.testPaymentGateway,
      onSuccess: () => invalidate(),
    }),
  }
}

export function usePaymentGateways() {
  return useQuery({ queryKey: ["payment-gateways"], queryFn: api.getPaymentGatewayStatus })
}

export function useMaintenance() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["maintenance", agenceId], queryFn: () => api.fetchMaintenance(agenceId) })
}

export function useMaintenanceMutations() {
  const invalidate = useInvalidate()
  const agenceId = useAgenceId()
  return {
    create: useMutation({
      mutationFn: (data: Omit<Parameters<typeof api.createMaintenance>[0], "agenceId">) => api.createMaintenance({ ...data, agenceId }),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, ...patch }: { id: string } & Partial<Parameters<typeof api.createMaintenance>[0]>) =>
        api.updateMaintenance(id, patch),
      onSuccess: invalidate,
    }),
    complete: useMutation({ mutationFn: api.deleteMaintenance, onSuccess: invalidate }),
  }
}

export function useFuelRecords() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["fuel", agenceId], queryFn: () => api.fetchFuelRecords(agenceId) })
}

export function useFuelMutations() {
  const invalidate = useInvalidate()
  const agenceId = useAgenceId()
  return {
    create: useMutation({
      mutationFn: (data: Omit<Parameters<typeof api.createFuelRecord>[0], "agenceId">) => api.createFuelRecord({ ...data, agenceId }),
      onSuccess: invalidate,
    }),
  }
}

export function useEmployees() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["employees", agenceId], queryFn: () => api.fetchEmployees(agenceId) })
}

export function useEmployeeMutations() {
  const invalidate = useInvalidate()
  const agenceId = useAgenceId()
  return {
    create: useMutation({
      mutationFn: (data: Omit<Parameters<typeof api.createEmployee>[0], "agenceId">) => api.createEmployee({ ...data, agenceId }),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, ...patch }: { id: string } & Partial<Parameters<typeof api.createEmployee>[0]>) =>
        api.updateEmployee(id, patch),
      onSuccess: invalidate,
    }),
  }
}

export function useMessages() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["messages", agenceId], queryFn: () => api.fetchMessages(agenceId) })
}

export function useMessageMutations() {
  const invalidate = useInvalidate()
  const agenceId = useAgenceId()
  return {
    send: useMutation({
      mutationFn: (data: Omit<Parameters<typeof api.sendMessage>[0], "agenceId" | "id" | "time" | "unread">) =>
        api.sendMessage({
          ...data,
          agenceId,
          time: "À l'instant",
          unread: false,
        }),
      onSuccess: invalidate,
    }),
    markRead: useMutation({ mutationFn: api.markMessageRead, onSuccess: invalidate }),
  }
}

export function useAlerts() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["alerts", agenceId], queryFn: () => api.fetchAlerts(agenceId) })
}

export function useTracking() {
  const agenceId = useAgenceId()
  return useQuery({ queryKey: ["tracking", agenceId], queryFn: () => api.fetchTracking(agenceId) })
}

export function useAgences() {
  return useQuery({ queryKey: ["agences"], queryFn: api.fetchAgences })
}

export function useGlobalSearch(query: string) {
  const agenceId = useAgenceId()
  return useQuery({
    queryKey: ["search", query, agenceId],
    queryFn: () => api.searchGlobal(query, agenceId),
    enabled: query.length >= 2,
  })
}

export function useDashboardStats() {
  const { data: missions } = useMissions()
  const { data: vehicles } = useVehicles()
  const { data: alerts } = useAlerts()
  const { data: documents } = useDocuments()
  const { data: fuel } = useFuelRecords()

  const missionsList = missions ?? []
  const fuelList = fuel ?? []
  const monthStats = sumLivreesThisMonth(missionsList)

  const missionsEnCours = missionsList.filter((m) => m.statut === "en_cours" || m.statut === "en_retard").length
  const missionsEnRetard = missionsList.filter((m) => m.statut === "en_retard").length
  const vehiculesDisponibles = vehicles?.filter((v) => v.statut === "disponible").length ?? 0
  const revenusMois = monthStats.revenus
  const depensesMois = monthStats.depenses + sumFuelThisMonth(fuelList)
  const carburantMois = sumFuelThisMonth(fuelList)
  const documentsExpirant = countExpiringDocuments(documents ?? [])
  const revenueChart = buildRevenueChart(missionsList, fuelList)

  return {
    vehiculesDisponibles,
    missionsEnCours,
    missionsEnRetard,
    revenusMois,
    depensesMois,
    carburantMois,
    alertes: alerts?.length ?? 0,
    documentsExpirant,
    missionsLivreesMois: monthStats.count,
    revenueChart,
  }
}
