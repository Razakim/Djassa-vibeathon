import type { RouteObject } from "react-router-dom"
import { PaymentsPage } from "./components/payments-page"

export const routes: RouteObject[] = [
  { path: "payments", element: <PaymentsPage /> },
]
