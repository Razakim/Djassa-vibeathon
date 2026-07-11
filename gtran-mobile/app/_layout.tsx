import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Providers } from "@/app/providers"

export default function RootLayout() {
  return (
    <Providers>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(chauffeur)" />
        <Stack.Screen name="(exploitant)" />
      </Stack>
    </Providers>
  )
}
