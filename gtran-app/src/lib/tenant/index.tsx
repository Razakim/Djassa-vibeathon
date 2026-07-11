import { createContext, useContext, useState, type ReactNode } from "react"
import type { Agence, Entreprise, TenantScope } from "@/types/shared"

interface TenantContextValue extends TenantScope {
  entreprise: Entreprise
  agence: Agence
  agences: Agence[]
  setAgence: (agenceId: string) => void
}

const TenantContext = createContext<TenantContextValue | null>(null)

const entreprise: Entreprise = {
  id: "ent-1",
  nom: "TransAfrique Logistique",
  devise: "XOF",
}

const agences: Agence[] = [
  { id: "ag-1", entrepriseId: "ent-1", nom: "Siège Abidjan", ville: "Abidjan" },
  { id: "ag-2", entrepriseId: "ent-1", nom: "Agence Bouaké", ville: "Bouaké" },
  { id: "ag-3", entrepriseId: "ent-1", nom: "Agence San Pedro", ville: "San Pedro" },
]

export function TenantProvider({ children }: { children: ReactNode }) {
  const [agenceId, setAgenceId] = useState(agences[0].id)
  const agence = agences.find((a) => a.id === agenceId) ?? agences[0]

  return (
    <TenantContext.Provider
      value={{
        entrepriseId: entreprise.id,
        agenceId: agence.id,
        entreprise,
        agence,
        agences,
        setAgence: setAgenceId,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) throw new Error("useTenant must be used within TenantProvider")
  return context
}
