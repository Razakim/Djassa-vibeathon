import { Stack } from "expo-router"

export default function DriverLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="mission/[id]" options={{ title: "Mission" }} />
      <Stack.Screen name="tracking" options={{ title: "Suivi GPS" }} />
      <Stack.Screen name="delivery/[id]" options={{ title: "Livraison" }} />
    </Stack>
  )
}
