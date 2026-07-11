import { useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { GooeyInput } from "@/components/shared/gooey-input"
import { useAuth } from "@/lib/auth"
import { updateAccount } from "@/lib/mock-api"

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [nom, setNom] = useState(user?.nom ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    try {
      await updateAccount(user.id, { nom, email })
      updateProfile({ nom, email })
      toast.success("Profil mis à jour")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <PageHeader title="Mon profil" description="Gérez vos informations personnelles" />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
              {user?.nom
                .split(" ")
                .map((n) => n[0])
                .join("") ?? "?"}
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.nom}</p>
              <Badge variant="secondary">{user?.role}</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <GooeyInput label="Nom complet" value={nom} onChange={(e) => setNom(e.target.value)} />
            <GooeyInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div>
              <Label className="text-muted-foreground">Rôle</Label>
              <Input value={user?.role ?? ""} disabled className="mt-1.5" />
            </div>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
