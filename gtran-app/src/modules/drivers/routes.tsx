import type { RouteObject } from "react-router-dom"
import { DriversPage } from "./components/drivers-page"

export const routes: RouteObject[] = [
  { path: "drivers", element: <DriversPage /> },
]
