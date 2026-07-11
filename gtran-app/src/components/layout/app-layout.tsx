import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { SidebarProvider } from "@/components/layout/sidebar-context"
import { Topbar } from "@/components/layout/topbar"

export function AppLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <SidebarProvider>
      <div className="flex h-svh overflow-hidden bg-background font-dm-sans selection:bg-ivory-orange selection:text-white">
        <Sidebar />
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden relative">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          
          <main className="flex-1 overflow-y-auto overscroll-contain relative bg-zinc-50/50 dark:bg-transparent">
            {/* Background branding subtle watermark - High-end touch */}
            <div className="fixed top-0 right-0 p-32 opacity-[0.03] pointer-events-none select-none z-0">
               <img 
                 src="https://images.pexels.com/photos/37258508/pexels-photo-37258508.jpeg?auto=format&w=1280&q=80&fit=crop" 
                 alt="" 
                 className="w-[1000px] h-auto grayscale brightness-50 contrast-125"
               />
            </div>

            <div className="relative z-10 p-4 lg:p-8 min-h-full">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.23, 1, 0.32, 1] 
                  }}
                  className="w-full h-full"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
