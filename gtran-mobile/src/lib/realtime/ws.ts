const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? "ws://localhost:8000/ws"

export class RealtimeClient {
  private socket: WebSocket | null = null

  connect(token?: string) {
    const url = token ? `${WS_URL}?token=${token}` : WS_URL
    this.socket = new WebSocket(url)
    return this.socket
  }

  disconnect() {
    this.socket?.close()
    this.socket = null
  }
}

export const realtimeClient = new RealtimeClient()
