import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence } from "motion/react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { SidebarProvider } from "@/components/layout/sidebar-context"
import { Topbar } from "@/components/layout/topbar"
import { AnimatedPage } from "@/components/shared/animated-page"

export function AppLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <SidebarProvider>
      <div className="flex h-svh overflow-hidden bg-background">
        <Sidebar />
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto overscroll-contain p-4 lg:p-6">
            <AnimatePresence mode="wait">
              <AnimatedPage key={location.pathname}>
                <Outlet />
              </AnimatedPage>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
