import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, LogOut, Menu, Search, User, Settings, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "motion/react"
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
import { cn } from "@/lib/utils"

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const { data: alerts } = useAlerts()
  const { data: results } = useGlobalSearch(query)

  const alertCount = alerts?.length ?? 0

  const handleLogout = () => {
    logout()
    toast.success("Déconnexion réussie")
    navigate("/login")
  }

  const initials = user?.nom
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?"

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 lg:px-6">
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0 rounded-xl"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </Button>

      {/* Agency switcher */}
      <EntitySwitcher />

      {/* Global Search */}
      <div className="relative flex-1 max-w-lg hidden md:block">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher missions, véhicules, chauffeurs..."
            className={cn(
              "w-full h-10 pl-10 pr-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900",
              "text-sm font-medium placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-2 focus:ring-ivory-emerald/30 focus:border-ivory-emerald",
              "transition-all duration-200"
            )}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchOpen(e.target.value.length >= 2)
            }}
            onFocus={() => query.length >= 2 && setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
        </div>

        <AnimatePresence>
          {searchOpen && results && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 z-50 overflow-hidden"
            >
              {results.missions.length === 0 &&
              results.vehicles.length === 0 &&
              results.drivers.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  Aucun résultat pour « {query} »
                </p>
              ) : (
                <div className="p-2 space-y-1">
                  {results.missions.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Missions
                      </p>
                      {results.missions.map((m) => (
                        <button
                          key={m.id}
                          className="w-full text-left rounded-xl px-3 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group"
                          onMouseDown={() => navigate("/missions")}
                        >
                          <span>
                            <span className="font-mono font-bold text-xs text-ivory-orange">{m.id}</span>
                            <span className="text-muted-foreground ml-2">{m.client}</span>
                          </span>
                          <ChevronRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                  {results.vehicles.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Véhicules
                      </p>
                      {results.vehicles.map((v) => (
                        <button
                          key={v.id}
                          className="w-full text-left rounded-xl px-3 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group"
                          onMouseDown={() => navigate("/fleet")}
                        >
                          <span>
                            <span className="font-mono font-bold text-xs">{v.immatriculation}</span>
                            <span className="text-muted-foreground ml-2">{v.type}</span>
                          </span>
                          <ChevronRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                  {results.drivers.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Chauffeurs
                      </p>
                      {results.drivers.map((d) => (
                        <button
                          key={d.id}
                          className="w-full text-left rounded-xl px-3 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group"
                          onMouseDown={() => navigate("/drivers")}
                        >
                          <span>
                            <span className="font-bold">{d.nom}</span>
                            <span className="text-muted-foreground ml-2 text-xs">{d.categorie}</span>
                          </span>
                          <ChevronRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="size-4.5" />
              {alertCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-ivory-orange text-white text-[9px] font-black"
                >
                  {alertCount > 9 ? "9+" : alertCount}
                </motion.span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 shadow-xl">
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-3 py-2">
              Alertes Opérationnelles ({alertCount})
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alertCount === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                Aucune alerte active
              </div>
            ) : (
              <div className="max-h-72 overflow-auto space-y-1">
                {alerts?.map((a) => (
                  <DropdownMenuItem
                    key={a.id}
                    className="flex flex-col items-start gap-1.5 rounded-xl p-3 cursor-pointer"
                  >
                    <Badge
                      variant={
                        a.severity === "danger"
                          ? "destructive"
                          : a.severity === "warning"
                            ? "warning"
                            : "info"
                      }
                      className="text-[9px] font-black uppercase tracking-wider"
                    >
                      {a.type}
                    </Badge>
                    <span className="text-sm leading-snug">{a.message}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2.5 px-2 rounded-xl h-10 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Avatar className="size-8 border-2 border-ivory-orange/30">
                <AvatarFallback className="bg-ivory-orange text-white font-black text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:flex flex-col items-start">
                <span className="block text-xs font-black uppercase tracking-tight">{user?.nom}</span>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  {user?.role}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl">
            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground px-3 py-2">
              Mon compte
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="rounded-xl gap-3 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <User className="size-4 text-muted-foreground" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl gap-3 cursor-pointer"
              onClick={() => navigate("/companies")}
            >
              <Settings className="size-4 text-muted-foreground" />
              Paramètres entreprise
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl gap-3 cursor-pointer text-destructive focus:text-destructive focus:bg-red-50 dark:focus:bg-red-900/20"
            >
              <LogOut className="size-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
