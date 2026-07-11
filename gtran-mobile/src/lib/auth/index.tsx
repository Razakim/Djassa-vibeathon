import { createContext, ReactNode, useContext, useMemo, useState } from "react"

export interface AuthUser {
  id: string
  nom: string
  email: string
  role: "admin" | "gestionnaire" | "chauffeur"
}

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login() {
        // TODO: brancher gtran-api + SecureStore
        setUser({ id: "demo", nom: "Demo", email: "demo@gtran.app", role: "chauffeur" })
      },
      logout() {
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
