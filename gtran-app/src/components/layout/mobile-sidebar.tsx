import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { NavLink } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Truck, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { navGroups, navItems } from "@/lib/navigation"

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    navRef.current?.scrollTo({ top: 0 })
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-[2px] lg:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 380 }}
            className="fixed inset-y-0 left-0 z-[210] flex w-[min(18rem,85vw)] flex-col border-r bg-sidebar text-sidebar-foreground shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
          >
            <div className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Truck className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">Djassa</p>
                <p className="text-xs text-muted-foreground">Transport & Logistique</p>
              </div>
              <Button variant="ghost" size="icon" className="size-9" onClick={onClose}>
                <X className="size-4" />
              </Button>
            </div>

            <div ref={navRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <nav className="space-y-5 px-3 py-4">
                {navGroups.map((group) => (
                  <div key={group}>
                    <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {group}
                    </p>
                    <div className="space-y-0.5">
                      {navItems
                        .filter((item) => item.group === group)
                        .map((item) => (
                          <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.href === "/"}
                            onClick={onClose}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "text-muted-foreground hover:bg-sidebar-accent/50"
                              )
                            }
                          >
                            <item.icon className="size-[18px] shrink-0" />
                            <span>{item.title}</span>
                          </NavLink>
                        ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <Separator />
            <div className="shrink-0 p-4 text-xs text-muted-foreground">
              <p className="font-medium">Djassa v0.3.0</p>
              <p className="mt-0.5">Socle 03 — interactif</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
