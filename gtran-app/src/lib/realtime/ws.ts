import { getWsUrl } from "@/lib/api/client"

export class RealtimeClient {
  private socket: WebSocket | null = null

  connect(url: string) {
    this.socket = new WebSocket(url)
    return this.socket
  }

  connectTracking(agenceId?: string) {
    const path = agenceId ? `/ws/tracking?agenceId=${encodeURIComponent(agenceId)}` : "/ws/tracking"
    return this.connect(getWsUrl(path))
  }

  disconnect() {
    this.socket?.close()
    this.socket = null
  }
}

export const realtimeClient = new RealtimeClient()
