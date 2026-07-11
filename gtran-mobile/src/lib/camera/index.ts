// Capture photo / scan document — brancher expo-camera

export interface CapturedPhoto {
  uri: string
  width: number
  height: number
}

export async function captureDeliveryProof(): Promise<CapturedPhoto | null> {
  // TODO: implémenter avec expo-camera
  return null
}
