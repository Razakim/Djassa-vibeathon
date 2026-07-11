import type { RouteObject } from "react-router-dom"
import { AnalyticsPage } from "./components/analytics-page"

export const routes: RouteObject[] = [
  { path: "analytics", element: <AnalyticsPage /> },
]
