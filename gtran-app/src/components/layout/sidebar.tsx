import { NavLink } from "react-router-dom"
import { Truck } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { navGroups, navItems } from "@/lib/navigation"

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Truck className="size-4" />
        </div>
        <div>
          <p className="font-bold text-sm">Gtran</p>
          <p className="text-xs text-muted-foreground">Transport & Logistique</p>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navGroups.map((group) => (
            <div key={group}>
              <p className="mb-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {group}
              </p>
              <div className="space-y-1">
                {navItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.href === "/"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )
                      }
                    >
                      <item.icon className="size-4" />
                      {item.title}
                    </NavLink>
                  ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-4 text-xs text-muted-foreground">
        <p>Gtran v0.1.0</p>
        <p className="mt-1">Mode sombre actif</p>
      </div>
    </aside>
  )
}
