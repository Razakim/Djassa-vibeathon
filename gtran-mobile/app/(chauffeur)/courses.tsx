import { ScrollView, StyleSheet, Text, View } from "react-native"
import { MissionCorridorCard, Heading, colors, fontFamily, fontSize, spacing } from "@/design-system"

const COURSES = [
  { reference: "MSN-2026-0847", depart: "Abidjan", arrivee: "Bamako", marchandise: "Cacao — 24 t", statut: "en_cours" },
  { reference: "MSN-2026-0812", depart: "San-Pédro", arrivee: "Ouagadougou", marchandise: "Anacarde — 18 t", statut: "planifiee" },
  { reference: "MSN-2026-0799", depart: "Abidjan", arrivee: "Lomé", marchandise: "Conteneur 40'", statut: "livree" },
]

export default function CoursesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Heading level={2}>Mes courses</Heading>
      <Text style={styles.sub}>Assignées à votre profil chauffeur</Text>
      {COURSES.map((m) => (
        <MissionCorridorCard key={m.reference} {...m} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  sub: { fontFamily: fontFamily.body, fontSize: fontSize.sm, color: colors.muted, marginTop: -8 },
})
