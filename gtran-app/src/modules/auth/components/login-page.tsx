import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { GooeyInput } from "@/components/shared/gooey-input"
import { AuthLayout } from "@/modules/auth/components/auth-layout"
import { useAuth } from "@/lib/auth"

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("amadou@transafrique.ci")
  const [password, setPassword] = useState("demo123")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success("Connexion réussie")
      navigate("/dashboard")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Bon retour" subtitle="Connectez-vous à votre plateforme de transport" backTo="/">
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <GooeyInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <GooeyInput
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </motion.div>
      </motion.form>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link to="/register" className="text-primary hover:underline font-medium">
          Créer un compte
        </Link>
      </p>
      <p className="text-center text-xs text-muted-foreground">
        Démo : amadou@transafrique.ci / demo123
      </p>
    </AuthLayout>
  )
}
