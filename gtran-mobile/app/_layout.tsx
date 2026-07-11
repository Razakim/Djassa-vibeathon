import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Providers } from "@/app/providers"

export default function RootLayout() {
  return (
    <Providers>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(driver)" />
      </Stack>
    </Providers>
  )
}
