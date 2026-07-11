const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000"

export interface ApiError {
  status: number
  message: string
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText)
    throw { status: res.status, message } satisfies ApiError
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
