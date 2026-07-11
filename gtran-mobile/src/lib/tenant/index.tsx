import { createContext, ReactNode, useContext, useMemo, useState } from "react"

interface TenantContextValue {
  entrepriseId: string | null
  agenceId: string | null
  setAgenceId: (id: string) => void
}

const TenantContext = createContext<TenantContextValue | null>(null)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [agenceId, setAgenceId] = useState<string | null>(null)

  const value = useMemo(
    () => ({
      entrepriseId: null,
      agenceId,
      setAgenceId,
    }),
    [agenceId],
  )

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error("useTenant must be used within TenantProvider")
  return ctx
}
