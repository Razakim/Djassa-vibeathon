import type { RouteObject } from "react-router-dom"
import { HrPage } from "./components/hr-page"

export const routes: RouteObject[] = [
  { path: "hr", element: <HrPage /> },
]
