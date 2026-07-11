import { View, Text, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { DjassaButton, colors, fontFamily, fontSize, spacing } from "@/design-system"

export default function GpsScreen() {
  return (
    <View style={styles.root}>
      <LinearGradient colors={["#003D29", colors.primary, "#004D35"]} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <Text style={styles.live}>● LIVE</Text>
        <Text style={styles.title}>SUIVI GPS</Text>
        <Text style={styles.coords}>5.3364° N · 4.0267° W</Text>
        <Text style={styles.speed}>62 km/h · Corridor Abidjan-Yamoussoukro</Text>

        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapLabel}>Carte terrain</Text>
          <Text style={styles.mapHint}>react-native-maps + tracé corridor — V2</Text>
        </View>

        <DjassaButton label="Partager position flotte" variant="accent" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, padding: spacing.lg, gap: spacing.md },
  live: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xs, color: colors.accent, letterSpacing: 2 },
  title: {
    fontFamily: fontFamily.display,
    fontSize: fontSize["2xl"],
    color: colors.primaryForeground,
    textTransform: "uppercase",
  },
  coords: { fontFamily: fontFamily.mono, fontSize: fontSize.lg, color: colors.primaryForeground },
  speed: { fontFamily: fontFamily.body, fontSize: fontSize.sm, color: "rgba(255,255,255,0.6)" },
  mapPlaceholder: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 220,
  },
  mapLabel: { fontFamily: fontFamily.heading, fontSize: fontSize.lg, color: colors.primaryForeground },
  mapHint: { fontFamily: fontFamily.body, fontSize: fontSize.xs, color: "rgba(255,255,255,0.45)", marginTop: 4 },
})
