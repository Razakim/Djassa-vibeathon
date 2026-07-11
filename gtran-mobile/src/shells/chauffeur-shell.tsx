import { ReactNode } from "react"
import { View, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { FieldDock } from "@/design-system"
import { CHAUFFEUR_DOCK } from "@/navigation/dock-config"
import { colors, spacing } from "@/design-system/tokens"

interface ChauffeurShellProps {
  children: ReactNode
}

/** Shell terrain chauffeur — contenu + Field Dock fixe */
export function ChauffeurShell({ children }: ChauffeurShellProps) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.body}>{children}</View>
      <FieldDock items={CHAUFFEUR_DOCK} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, paddingBottom: 100 },
})
