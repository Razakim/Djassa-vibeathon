import { StyleSheet, Text, View } from "react-native"
import { useRouter } from "expo-router"
import { BrandWordmark, DjassaButton, Heading, Surface, colors, fontFamily, fontSize, spacing } from "@/design-system"
import { useAuth } from "@/lib/auth"

export default function CompteScreen() {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <View style={styles.content}>
      <BrandWordmark size="sm" />
      <Heading level={2}>Mon profil</Heading>
      <Surface elevated>
        <Text style={styles.label}>Nom</Text>
        <Text style={styles.value}>{user?.nom}</Text>
        <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={[styles.label, { marginTop: 12 }]}>Rôle terrain</Text>
        <Text style={styles.value}>{user?.role}</Text>
      </Surface>
      <DjassaButton
        label="Se déconnecter"
        variant="outline"
        onPress={() => {
          logout()
          router.replace("/(onboarding)/login" as never)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: spacing.lg, gap: spacing.md },
  label: { fontFamily: fontFamily.body, fontSize: fontSize.xs, color: colors.muted, textTransform: "uppercase" },
  value: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base, color: colors.foreground },
})
