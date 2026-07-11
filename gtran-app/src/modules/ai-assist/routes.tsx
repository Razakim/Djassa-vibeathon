import type { RouteObject } from "react-router-dom"
import { AiAssistPage } from "./components/ai-assist-page"

export const routes: RouteObject[] = [
  { path: "ai-assist", element: <AiAssistPage /> },
]
