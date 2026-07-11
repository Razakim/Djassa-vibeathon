import type { RouteObject } from "react-router-dom"
import { BillingPage } from "./components/billing-page"

export const routes: RouteObject[] = [
  { path: "billing", element: <BillingPage /> },
]
