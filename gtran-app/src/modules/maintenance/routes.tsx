import type { RouteObject } from "react-router-dom"
import { MaintenancePage } from "./components/maintenance-page"

export const routes: RouteObject[] = [
  { path: "maintenance", element: <MaintenancePage /> },
]
