import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native"
import { Link, useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  AuthCover,
  BrandWordmark,
  DjassaButton,
  GooeyField,
  Heading,
  colors,
  fontFamily,
  fontSize,
  spacing,
} from "@/design-system"
import { useAuth } from "@/lib/auth"

const DEMO_ACCOUNTS = [
  { email: "kouame@gtran.ci", role: "chauffeur" as const, label: "Chauffeur terrain" },
  { email: "amadou@transafrique.ci", role: "gestionnaire" as const, label: "Exploitant" },
]

export default function LoginScreen() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("kouame@gtran.ci")
  const [password, setPassword] = useState("demo123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const user = await login(email, password)
      const home = user.role === "chauffeur" ? "/(chauffeur)" : "/(exploitant)"
      router.replace(home as never)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connexion impossible")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.root}>
      <AuthCover>
        <SafeAreaView style={styles.coverContent}>
          <BrandWordmark light size="md" />
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>
              Le terrain.{"\n"}
              <Text style={styles.heroAccent}>Pas le bureau.</Text>
            </Text>
            <Text style={styles.heroSub}>
              Missions, GPS, livraisons signées — l'app des chauffeurs et exploitants nomades en Afrique de l'Ouest.
            </Text>
          </View>
        </SafeAreaView>
      </AuthCover>

      <KeyboardAvoidingView
        style={styles.formPanel}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">
          <Heading level={2}>Bon retour</Heading>
          <Text style={styles.subtitle}>Connectez-vous à DjassaOS Terrain</Text>

          <View style={styles.fields}>
            <GooeyField
              label="Email professionnel"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <GooeyField
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <DjassaButton label="Entrer sur le terrain" onPress={handleLogin} loading={loading} />

          <View style={styles.demo}>
            <Text style={styles.demoLabel}>Comptes démo</Text>
            {DEMO_ACCOUNTS.map((acc) => (
              <Pressable
                key={acc.email}
                style={styles.demoChip}
                onPress={() => {
                  setEmail(acc.email)
                  setPassword("demo123")
                }}
              >
                <Text style={styles.demoChipRole}>{acc.label}</Text>
                <Text style={styles.demoChipEmail}>{acc.email}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.register}>
            Pas encore de compte ?{" "}
            <Link href="/(onboarding)/register" style={styles.registerLink}>
              Créer un accès
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  coverContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "space-between",
    minHeight: 280,
  },
  hero: { paddingBottom: spacing.lg },
  heroTitle: {
    fontFamily: fontFamily.display,
    fontSize: fontSize["2xl"],
    color: colors.primaryForeground,
    textTransform: "uppercase",
    lineHeight: 32,
    marginTop: spacing.xl,
  },
  heroAccent: { color: colors.accent },
  heroSub: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.65)",
    marginTop: spacing.sm,
    lineHeight: 20,
    maxWidth: 320,
  },
  formPanel: {
    flex: 1.1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
  },
  formScroll: {
    padding: spacing.lg,
    paddingBottom: spacing["2xl"],
    gap: spacing.md,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.muted,
    marginTop: -spacing.sm,
  },
  fields: { gap: spacing.md, marginVertical: spacing.sm },
  error: { fontFamily: fontFamily.bodyMedium, fontSize: fontSize.sm, color: "#C41E3A" },
  demo: { gap: spacing.sm, marginTop: spacing.sm },
  demoLabel: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.xs,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  demoChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  demoChipRole: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm, color: colors.primary },
  demoChipEmail: { fontFamily: fontFamily.body, fontSize: fontSize.xs, color: colors.muted, marginTop: 2 },
  register: { fontFamily: fontFamily.body, fontSize: fontSize.sm, color: colors.muted, textAlign: "center" },
  registerLink: { color: colors.primary, fontFamily: fontFamily.bodyBold },
})
