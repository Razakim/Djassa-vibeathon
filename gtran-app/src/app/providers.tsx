import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { AuthProvider } from "@/lib/auth"
import { TenantProvider } from "@/lib/tenant"
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          {children}
          <Toaster 
            position="top-right"
            expand={false}
            richColors
            closeButton
          />
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
