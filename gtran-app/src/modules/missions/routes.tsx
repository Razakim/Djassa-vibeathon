import type { RouteObject } from "react-router-dom"
import { MissionsPage } from "./components/missions-page"

export const routes: RouteObject[] = [
  { path: "missions", element: <MissionsPage /> },
]
