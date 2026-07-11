export class RealtimeClient {
  private socket: WebSocket | null = null

  connect(url: string) {
    this.socket = new WebSocket(url)
    return this.socket
  }

  disconnect() {
    this.socket?.close()
    this.socket = null
  }
}

export const realtimeClient = new RealtimeClient()
