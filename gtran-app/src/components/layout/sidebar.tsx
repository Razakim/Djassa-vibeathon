import { NavLink } from "react-router-dom"
import { ChevronLeft, ChevronRight, LogOut, Plus } from "lucide-react"
import { BrandLogo } from "@/components/shared/brand-logo"
import { motion, AnimatePresence } from "motion/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { navGroups, navItems } from "@/lib/navigation"
import { useSidebar } from "@/components/layout/sidebar-context"
import { useAuth } from "@/lib/auth/index"

const SIDEBAR_EXPANDED = 280
const SIDEBAR_COLLAPSED = 84

export function Sidebar() {
  const { collapsed, toggle } = useSidebar()
  const { user, logout } = useAuth()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "hidden lg:flex h-full shrink-0 flex-col border-r bg-ivory-emerald text-white shadow-2xl overflow-hidden z-40 relative group/sidebar"
        )}
      >
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 size-64 bg-white/5 blur-3xl rounded-full pointer-events-none" />
        
        {/* Branding Area */}
        <div className={cn(
          "flex h-20 shrink-0 items-center px-6 transition-all border-b border-white/5",
          collapsed && "justify-center px-0"
        )}>
          <motion.div layout className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl shadow-lg">
              <BrandLogo variant="mark" size={collapsed ? 28 : 32} className="text-ivory-emerald" />
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col"
                >
                  <span className="text-xl font-inter font-black uppercase tracking-tighter leading-none">Djassa<span className="text-ivory-orange">OS</span></span>
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40">Logistics Hub</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Quick Action Button */}
        <div className={cn("px-4 py-8 transition-all", collapsed ? "px-2" : "px-6")}>
          <Button 
            variant="orange"
            className={cn(
              "w-full bg-ivory-orange hover:bg-ivory-orange/90 text-white border-none shadow-[0_8px_16px_rgba(226,88,34,0.3)] hover:shadow-[0_12px_24px_rgba(226,88,34,0.4)] transition-all active:scale-95 font-black uppercase tracking-widest",
              collapsed ? "size-14 p-0 rounded-2xl" : "h-14 rounded-2xl text-[10px]"
            )}
          >
            <Plus className={cn("size-6", !collapsed && "mr-2")} strokeWidth={4} />
            {!collapsed && "Nouvelle Mission"}
          </Button>
        </div>

        {/* Navigation Content */}
        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-10 pb-12">
            {navGroups.map((group) => (
              <div key={group} className="space-y-3">
                {!collapsed && (
                  <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 select-none">
                    {group}
                  </h4>
                )}
                <div className="space-y-1">
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
                              "group relative flex items-center rounded-2xl text-sm font-bold transition-all duration-300",
                              collapsed 
                                ? "size-14 justify-center mx-auto" 
                                : "h-12 px-4 gap-4",
                              isActive
                                ? "bg-white/10 text-white shadow-xl"
                                : "text-white/40 hover:bg-white/5 hover:text-white"
                            )
                          }
                        >
                          <item.icon className={cn(
                            "size-5 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:text-ivory-orange",
                            "group-[.active]:text-ivory-orange"
                          )} />
                          {!collapsed && <span className="truncate tracking-tight">{item.title}</span>}
                          
                          {/* Indicator for Active State */}
                          <span
                            className="absolute left-0 w-1.5 h-6 rounded-r-full transition-all duration-500"
                            aria-hidden="true"
                          />
                        </NavLink>
                      )

                      if (collapsed) {
                        return (
                          <Tooltip key={item.href}>
                            <TooltipTrigger asChild>{link}</TooltipTrigger>
                            <TooltipContent 
                              side="right" 
                              sideOffset={15}
                              className="bg-zinc-900 border-none text-white px-4 py-2 font-black uppercase tracking-widest text-[10px] shadow-2xl"
                            >
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

        {/* User Profile & System Actions */}
        <div className="mt-auto border-t border-white/5 bg-black/5 p-4 space-y-4">
          <div className={cn(
            "flex items-center gap-3 rounded-2xl bg-white/5 p-2 transition-all",
            collapsed ? "justify-center" : "px-3 py-3"
          )}>
            <div className="relative shrink-0">
              <Avatar className="size-10 border-2 border-white/10 shadow-lg">
                <AvatarFallback className="bg-ivory-orange text-white font-black text-xs">
                  {user?.nom?.[0]?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-emerald-500 border-2 border-ivory-emerald rounded-full shadow-sm" />
            </div>
            
            {!collapsed && (
              <div className="flex flex-1 flex-col min-w-0">
                <span className="truncate text-sm font-black text-white uppercase tracking-tight">{user?.nom || "Administrateur"}</span>
                <span className="truncate text-[10px] text-white/40 font-bold uppercase tracking-widest">{user?.role || "Opérations"}</span>
              </div>
            )}
            
            {!collapsed && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-8 text-white/20 hover:text-white hover:bg-white/10 rounded-lg"
                onClick={logout}
              >
                <LogOut className="size-4" />
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={toggle}
            className={cn(
              "w-full text-white/30 hover:text-white hover:bg-white/5 rounded-2xl transition-all h-10 group",
              collapsed ? "px-0 justify-center" : "px-4 justify-between"
            )}
          >
            {collapsed ? <ChevronRight className="size-5" /> : (
              <>
                <div className="flex items-center">
                  <ChevronLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Masquer</span>
                </div>
                <div className="size-1.5 rounded-full bg-white/20" />
              </>
            )}
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
