import type { RouteObject } from "react-router-dom"
import { TrackingPage } from "./components/tracking-page"

export const routes: RouteObject[] = [
  { path: "tracking", element: <TrackingPage /> },
]
