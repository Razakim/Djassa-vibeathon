import { createContext, useContext, type ReactNode } from "react"
import type { User } from "@/types/shared"

interface AuthContextValue {
  user: User
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const mockUser: User = {
  id: "u-1",
  nom: "Amadou Diallo",
  email: "amadou@transafrique.ci",
  role: "Directeur exploitation",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
