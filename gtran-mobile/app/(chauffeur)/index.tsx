import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native"
import { useRouter } from "expo-router"
import {
  Heading,
  MissionCorridorCard,
  DjassaButton,
  colors,
  fontFamily,
  fontSize,
  spacing,
} from "@/design-system"
import { useAuth } from "@/lib/auth"

const ACTIVE_MISSION = {
  reference: "MSN-2026-0847",
  depart: "Abidjan",
  arrivee: "Bamako",
  marchandise: "Cacao — 24 t",
  statut: "en_cours",
}

export default function ChauffeurHome() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.top}>
        <Text style={styles.greeting}>Terrain · {user?.nom ?? "Chauffeur"}</Text>
        <Heading level={2}>Course du jour</Heading>
      </View>

      <MissionCorridorCard {...ACTIVE_MISSION} chauffeur={user?.nom} />

      <View style={styles.actions}>
        <DjassaButton
          label="Confirmer chargement"
          variant="primary"
          onPress={() => router.push("/(chauffeur)/gps" as never)}
        />
        <DjassaButton
          label="Ouvrir livraison"
          variant="accent"
          onPress={() => router.push("/(chauffeur)/livraison/MSN-2026-0847" as never)}
        />
      </View>

      <Pressable style={styles.alert}>
        <Text style={styles.alertIcon}>⚠</Text>
        <View style={styles.alertBody}>
          <Text style={styles.alertTitle}>Document permis — expire dans 12 jours</Text>
          <Text style={styles.alertSub}>Renouveler avant le 23/07/2026</Text>
        </View>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg },
  top: { gap: spacing.xs },
  greeting: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.xs,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  actions: { gap: spacing.sm },
  alert: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: "rgba(255, 191, 0, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 191, 0, 0.35)",
  },
  alertIcon: { fontSize: 20 },
  alertBody: { flex: 1 },
  alertTitle: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm, color: colors.foreground },
  alertSub: { fontFamily: fontFamily.body, fontSize: fontSize.xs, color: colors.muted, marginTop: 2 },
})
