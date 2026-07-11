import type { RouteObject } from "react-router-dom"
import { AccountingPage } from "./components/accounting-page"

export const routes: RouteObject[] = [
  { path: "accounting", element: <AccountingPage /> },
]
