import { Stack } from "expo-router"
import { ChauffeurShell } from "@/shells"

export default function ChauffeurLayout() {
  return (
    <ChauffeurShell>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
    </ChauffeurShell>
  )
}
