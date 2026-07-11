import type { RouteObject } from "react-router-dom"
import { FuelPage } from "./components/fuel-page"

export const routes: RouteObject[] = [
  { path: "fuel", element: <FuelPage /> },
]
