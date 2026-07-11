import type { RouteObject } from "react-router-dom"
import { DocumentsPage } from "./components/documents-page"

export const routes: RouteObject[] = [
  { path: "documents", element: <DocumentsPage /> },
]
