import { View, Text, StyleSheet } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Heading, DjassaButton, Surface, colors, fontFamily, fontSize, spacing } from "@/design-system"

export default function LivraisonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <View style={styles.content}>
      <Heading level={2}>Livraison</Heading>
      <Text style={styles.ref}>{id}</Text>

      <Surface elevated style={styles.capture}>
        <Text style={styles.captureIcon}>📷</Text>
        <Text style={styles.captureTitle}>Preuve photo</Text>
        <Text style={styles.captureHint}>Bon de livraison, marchandise, plaque</Text>
        <DjassaButton label="Capturer" variant="primary" />
      </Surface>

      <Surface elevated style={styles.capture}>
        <Text style={styles.captureIcon}>✍</Text>
        <Text style={styles.captureTitle}>Signature client</Text>
        <Text style={styles.captureHint}>Zone tactile plein écran — V2</Text>
        <DjassaButton label="Faire signer" variant="accent" />
      </Surface>

      <DjassaButton label="Confirmer livraison & générer facture" />
    </View>
  )
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: spacing.lg, gap: spacing.md },
  ref: { fontFamily: fontFamily.mono, fontSize: fontSize.sm, color: colors.muted, marginTop: -8 },
  capture: { alignItems: "center", gap: spacing.sm },
  captureIcon: { fontSize: 32 },
  captureTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.lg, color: colors.foreground },
  captureHint: { fontFamily: fontFamily.body, fontSize: fontSize.xs, color: colors.muted, textAlign: "center" },
})
