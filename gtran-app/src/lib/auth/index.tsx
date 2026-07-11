import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { loginAccount, registerAccount, updateAccount } from "@/lib/api"
import { getToken, setToken } from "@/lib/api/client"
import type { User } from "@/types/shared"

const AUTH_KEY = "gtran-auth"

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { nom: string; email: string; password: string }) => Promise<void>
  updateProfile: (patch: Partial<Pick<User, "nom" | "email">>) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadSession(): User | null {
  const raw = localStorage.getItem(AUTH_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}

function saveSession(user: User | null) {
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  else localStorage.removeItem(AUTH_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = loadSession()
    if (session && getToken()) setUser(session)
    else {
      setToken(null)
      saveSession(null)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginAccount(email, password)
    setToken(res.access_token)
    const session: User = {
      id: res.user.id,
      nom: res.user.nom,
      email: res.user.email,
      role: res.user.role,
    }
    saveSession(session)
    setUser(session)
  }, [])

  const register = useCallback(async (data: { nom: string; email: string; password: string }) => {
    const res = await registerAccount(data)
    setToken(res.access_token)
    const session: User = {
      id: res.user.id,
      nom: res.user.nom,
      email: res.user.email,
      role: res.user.role,
    }
    saveSession(session)
    setUser(session)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    saveSession(null)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (patch: Partial<Pick<User, "nom" | "email">>) => {
    if (!user) return
    const updated = await updateAccount(patch)
    const next: User = { ...user, nom: updated.nom, email: updated.email }
    saveSession(next)
    setUser(next)
  }, [user])

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
