import { NavLink } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BrandLogo } from "@/components/shared/brand-logo"
import { motion, AnimatePresence } from "motion/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { navGroups, navItems } from "@/lib/navigation"
import { useSidebar } from "@/components/layout/sidebar-context"

const SIDEBAR_EXPANDED = 260
const SIDEBAR_COLLAPSED = 68

export function Sidebar() {
  const { collapsed, toggle } = useSidebar()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "hidden lg:flex h-full shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground",
          "overflow-hidden z-40"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-14 shrink-0 items-center border-b",
            collapsed ? "justify-center px-0" : "gap-2 px-4"
          )}
        >
          <BrandLogo variant="mark" size={collapsed ? 28 : 32} />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="min-w-0 flex-1 overflow-hidden"
              >
                <p className="truncate text-sm font-bold">Djassa</p>
                <p className="truncate text-xs text-muted-foreground">Transport & Logistique</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={toggle}>
              <ChevronLeft className="size-4" />
            </Button>
          )}
        </div>

        {/* Nav */}
        <ScrollArea className="min-h-0 flex-1">
          <nav className={cn("py-3", collapsed ? "px-2" : "px-3")}>
            {navGroups.map((group, groupIndex) => (
              <div key={group} className={cn(groupIndex > 0 && (collapsed ? "mt-2" : "mt-5"))}>
                {groupIndex > 0 && collapsed && <Separator className="mb-2" />}
                <AnimatePresence>
                  {!collapsed && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {group}
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="space-y-0.5">
                  {navItems
                    .filter((item) => item.group === group)
                    .map((item) => {
                      const link = (
                        <NavLink
                          key={item.href}
                          to={item.href}
                          end={item.href === "/dashboard"}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center rounded-lg text-sm transition-colors",
                              collapsed
                                ? "size-10 justify-center mx-auto"
                                : "gap-3 px-3 py-2",
                              isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )
                          }
                        >
                          <item.icon className="size-[18px] shrink-0" />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </NavLink>
                      )

                      if (collapsed) {
                        return (
                          <Tooltip key={item.href}>
                            <TooltipTrigger asChild>{link}</TooltipTrigger>
                            <TooltipContent side="right" sideOffset={8}>
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        )
                      }
                      return link
                    })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer + collapse toggle when collapsed */}
        <div className="shrink-0 border-t">
          <AnimatePresence mode="wait">
            {collapsed ? (
              <motion.div
                key="collapsed-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-1 py-3"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  onClick={toggle}
                  title="Développer le menu"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="expanded-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 py-3 text-xs text-muted-foreground"
              >
                <p className="font-medium">Djassa v0.3.0</p>
                <p className="mt-0.5">Socle 03 — interactif</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
