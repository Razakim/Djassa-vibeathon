import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Link } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { BrandWordmark, DjassaButton, GooeyField, Heading, colors, fontFamily, fontSize, spacing } from "@/design-system"

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <BrandWordmark size="sm" />
        <Heading level={2}>Créer un accès</Heading>
        <Text style={styles.subtitle}>Rejoignez votre flotte sur DjassaOS Terrain</Text>

        <View style={styles.fields}>
          <GooeyField label="Nom complet" placeholder="Kouamé N'Guessan" />
          <GooeyField label="Email professionnel" keyboardType="email-address" autoCapitalize="none" />
          <GooeyField label="Mot de passe" secureTextEntry />
          <GooeyField label="Code entreprise" placeholder="TRANS-AF-2026" hint="Fourni par votre exploitant" />
        </View>

        <DjassaButton label="Demander l'accès" />
        <Link href="/(onboarding)/login" style={styles.back}>
          Déjà un compte ? Se connecter
        </Link>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.md },
  subtitle: { fontFamily: fontFamily.body, fontSize: fontSize.sm, color: colors.muted },
  fields: { gap: spacing.md, marginVertical: spacing.sm },
  back: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm, color: colors.primary, textAlign: "center" },
})
