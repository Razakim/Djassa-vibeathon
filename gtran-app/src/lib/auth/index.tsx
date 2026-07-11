import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { loginAccount, registerAccount } from "@/lib/mock-api"
import type { User } from "@/types/shared"

const AUTH_KEY = "gtran-auth"

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { nom: string; email: string; password: string }) => Promise<void>
  updateProfile: (patch: Partial<Pick<User, "nom" | "email">>) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadSession(): User | null {
  const raw = localStorage.getItem(AUTH_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(loadSession())
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const account = await loginAccount(email, password)
    const session: User = {
      id: account.id,
      nom: account.nom,
      email: account.email,
      role: account.role,
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(session))
    setUser(session)
  }, [])

  const register = useCallback(async (data: { nom: string; email: string; password: string }) => {
    const account = await registerAccount({
      ...data,
      role: "Administrateur",
      entrepriseId: "ent-1",
    })
    const session: User = {
      id: account.id,
      nom: account.nom,
      email: account.email,
      role: account.role,
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(session))
    setUser(session)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback((patch: Partial<Pick<User, "nom" | "email">>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      localStorage.setItem(AUTH_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
