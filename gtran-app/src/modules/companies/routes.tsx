import type { RouteObject } from "react-router-dom"
import { CompaniesPage } from "./components/companies-page"

export const companiesRoutes: RouteObject[] = [
  { path: "companies", element: <CompaniesPage /> },
]
