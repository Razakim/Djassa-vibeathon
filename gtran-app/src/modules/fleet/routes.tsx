import type { RouteObject } from "react-router-dom"
import { FleetPage } from "./components/fleet-page"

export const routes: RouteObject[] = [
  { path: "fleet", element: <FleetPage /> },
]
