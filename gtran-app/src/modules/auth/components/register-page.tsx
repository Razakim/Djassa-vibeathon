import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { GooeyInput } from "@/components/shared/gooey-input"
import { AuthLayout } from "@/modules/auth/components/auth-layout"
import { useAuth } from "@/lib/auth"

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères")
      return
    }
    setLoading(true)
    try {
      await register({ nom, email, password })
      toast.success("Compte créé avec succès")
      navigate("/")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur d'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Créer un compte" subtitle="Rejoignez Djassa pour piloter votre flotte">
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <GooeyInput label="Nom complet" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <GooeyInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <GooeyInput
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
        </motion.div>
      </motion.form>

      <p className="text-center text-sm text-muted-foreground">
        Déjà inscrit ?{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  )
}
