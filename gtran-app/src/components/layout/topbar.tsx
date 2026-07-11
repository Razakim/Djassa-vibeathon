import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, LogOut, Menu, Search } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EntitySwitcher } from "@/components/layout/entity-switcher"
import { useAuth } from "@/lib/auth"
import { useAlerts, useGlobalSearch } from "@/hooks/use-data"
import { Badge } from "@/components/ui/badge"

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const { data: alerts } = useAlerts()
  const { data: results } = useGlobalSearch(query)

  const handleLogout = () => {
    logout()
    toast.success("Déconnexion réussie")
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={onMenuClick}>
        <Menu className="size-5" />
      </Button>
      <EntitySwitcher />
      <div className="relative flex-1 max-w-md hidden md:block">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher missions, véhicules, clients..."
          className="pl-9"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSearchOpen(e.target.value.length >= 2)
          }}
          onFocus={() => query.length >= 2 && setSearchOpen(true)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
        />
        {searchOpen && results && (
          <div className="absolute top-full mt-1 w-full rounded-lg border bg-popover shadow-lg z-50 p-2 space-y-2 max-h-64 overflow-auto">
            {results.missions.length === 0 && results.vehicles.length === 0 && results.drivers.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">Aucun résultat</p>
            ) : (
              <>
                {results.missions.map((m) => (
                  <button
                    key={m.id}
                    className="w-full text-left rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    onMouseDown={() => navigate("/missions")}
                  >
                    Mission {m.id} — {m.client}
                  </button>
                ))}
                {results.vehicles.map((v) => (
                  <button
                    key={v.id}
                    className="w-full text-left rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    onMouseDown={() => navigate("/fleet")}
                  >
                    {v.immatriculation} — {v.type}
                  </button>
                ))}
                {results.drivers.map((d) => (
                  <button
                    key={d.id}
                    className="w-full text-left rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    onMouseDown={() => navigate("/drivers")}
                  >
                    {d.nom} — {d.categorie}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-4" />
              {(alerts?.length ?? 0) > 0 && (
                <Badge className="absolute -top-1 -right-1 size-5 p-0 text-[10px]" variant="destructive">
                  {alerts?.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Alertes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alerts?.map((a) => (
              <DropdownMenuItem key={a.id} className="flex flex-col items-start gap-1 whitespace-normal">
                <Badge variant={a.severity === "danger" ? "destructive" : a.severity === "warning" ? "warning" : "info"}>
                  {a.type}
                </Badge>
                <span className="text-sm">{a.message}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="size-8">
                <AvatarFallback>
                  {user?.nom
                    .split(" ")
                    .map((n) => n[0])
                    .join("") ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:block text-left">
                <span className="block text-sm font-medium">{user?.nom}</span>
                <span className="block text-xs text-muted-foreground">{user?.role}</span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>Profil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/companies")}>Paramètres entreprise</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="size-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
