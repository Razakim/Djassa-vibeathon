import * as Location from "expo-location"

export interface GeoPosition {
  latitude: number
  longitude: number
  accuracy: number | null
  heading: number | null
  speed: number | null
  timestamp: number
}

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync()
  return status === "granted"
}

export async function getCurrentPosition(): Promise<GeoPosition> {
  const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
  return {
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
    accuracy: loc.coords.accuracy,
    heading: loc.coords.heading,
    speed: loc.coords.speed,
    timestamp: loc.timestamp,
  }
}
