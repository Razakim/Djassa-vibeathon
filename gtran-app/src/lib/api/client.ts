const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "")
const TOKEN_KEY = "gtran-token"

export function getApiBase(): string {
  return API_BASE
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function apiClient<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> | undefined),
  }

  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}/api/v1${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) return undefined as T

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const detail = typeof body.detail === "string" ? body.detail : `API error: ${response.status}`
    throw new ApiError(detail, response.status)
  }

  return response.json() as Promise<T>
}

export function getWsUrl(path: string): string {
  const base = API_BASE.replace(/^http/, "ws")
  return `${base}${path}`
}
