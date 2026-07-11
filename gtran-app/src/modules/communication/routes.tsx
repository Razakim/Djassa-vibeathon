import type { RouteObject } from "react-router-dom"
import { CommunicationPage } from "./components/communication-page"

export const routes: RouteObject[] = [
  { path: "communication", element: <CommunicationPage /> },
]
