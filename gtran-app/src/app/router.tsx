import { createBrowserRouter, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute, GuestRoute } from "@/components/auth/protected-route"
import { LandingPage } from "@/modules/landing/components/landing-page"
import { LoginPage } from "@/modules/auth/components/login-page"
import { RegisterPage } from "@/modules/auth/components/register-page"
import { DashboardPage } from "@/modules/dashboard/components/dashboard-page"
import { CompaniesPage } from "@/modules/companies/components/companies-page"
import { FleetPage } from "@/modules/fleet/components/fleet-page"
import { DriversPage } from "@/modules/drivers/components/drivers-page"
import { MissionsPage } from "@/modules/missions/components/missions-page"
import { TrackingPage } from "@/modules/tracking/components/tracking-page"
import { DocumentsPage } from "@/modules/documents/components/documents-page"
import { AccountingPage } from "@/modules/accounting/components/accounting-page"
import { BillingPage } from "@/modules/billing/components/billing-page"
import { PaymentsPage } from "@/modules/payments/components/payments-page"
import { MaintenancePage } from "@/modules/maintenance/components/maintenance-page"
import { FuelPage } from "@/modules/fuel/components/fuel-page"
import { AnalyticsPage } from "@/modules/analytics/components/analytics-page"
import { HrPage } from "@/modules/hr/components/hr-page"
import { CommunicationPage } from "@/modules/communication/components/communication-page"
import { AiAssistPage } from "@/modules/ai-assist/components/ai-assist-page"
import { ProfilePage } from "@/modules/profile/components/profile-page"
import { useAuth } from "@/lib/auth"

function RootRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
}

export const router = createBrowserRouter([
  { path: "/", element: <RootRoute /> },
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "companies", element: <CompaniesPage /> },
          { path: "fleet", element: <FleetPage /> },
          { path: "drivers", element: <DriversPage /> },
          { path: "missions", element: <MissionsPage /> },
          { path: "tracking", element: <TrackingPage /> },
          { path: "documents", element: <DocumentsPage /> },
          { path: "accounting", element: <AccountingPage /> },
          { path: "billing", element: <BillingPage /> },
          { path: "payments", element: <PaymentsPage /> },
          { path: "maintenance", element: <MaintenancePage /> },
          { path: "fuel", element: <FuelPage /> },
          { path: "analytics", element: <AnalyticsPage /> },
          { path: "hr", element: <HrPage /> },
          { path: "communication", element: <CommunicationPage /> },
          { path: "ai-assist", element: <AiAssistPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
])
