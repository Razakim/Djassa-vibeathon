import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"

export interface AuthUser {
  id: string
  nom: string
  email: string
  role: "admin" | "gestionnaire" | "chauffeur"
}

interface AuthContextValue {
  user: AuthUser | null
  bootstrapped: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
}

const DEMO_USERS: Record<string, AuthUser> = {
  "kouame@gtran.ci": {
    id: "drv-1",
    nom: "Kouamé N'Guessan",
    email: "kouame@gtran.ci",
    role: "chauffeur",
  },
  "amadou@transafrique.ci": {
    id: "mgr-1",
    nom: "Amadou Diallo",
    email: "amadou@transafrique.ci",
    role: "gestionnaire",
  },
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [bootstrapped, setBootstrapped] = useState(false)

  useEffect(() => {
    // TODO: restaurer session depuis SecureStore
    setBootstrapped(true)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      bootstrapped,
      async login(email, password) {
        if (password !== "demo123") throw new Error("Identifiants incorrects")
        const found = DEMO_USERS[email.toLowerCase()]
        if (!found) throw new Error("Compte inconnu — utilisez un compte démo")
        setUser(found)
        return found
      },
      logout() {
        setUser(null)
      },
    }),
    [user, bootstrapped],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
