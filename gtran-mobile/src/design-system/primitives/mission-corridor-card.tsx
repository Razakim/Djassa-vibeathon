import { View, Text, StyleSheet } from "react-native"
import { colors, fontFamily, fontSize, radius, spacing } from "../tokens"
import { Surface } from "./surface"

const STATUS_COLORS: Record<string, string> = {
  planifiee: colors.muted,
  en_cours: colors.primary,
  en_retard: colors.accent,
  livree: colors.gold,
  annulee: "#C41E3A",
}

interface MissionCorridorCardProps {
  reference: string
  depart: string
  arrivee: string
  marchandise: string
  statut: keyof typeof STATUS_COLORS | string
  chauffeur?: string
}

/** Carte mission — visualise le corridor route (signature UX transport) */
export function MissionCorridorCard({
  reference,
  depart,
  arrivee,
  marchandise,
  statut,
  chauffeur,
}: MissionCorridorCardProps) {
  const statusColor = STATUS_COLORS[statut] ?? colors.muted

  return (
    <Surface elevated style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.ref}>{reference}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor + "18" }]}>
          <View style={[styles.badgeDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.badgeText, { color: statusColor }]}>{statut.replace("_", " ")}</Text>
        </View>
      </View>

      <View style={styles.corridor}>
        <View style={styles.node}>
          <View style={[styles.nodeDot, styles.nodeDepart]} />
          <Text style={styles.city}>{depart}</Text>
        </View>
        <View style={styles.line}>
          <View style={styles.lineDash} />
          <Text style={styles.truck}>🚛</Text>
        </View>
        <View style={[styles.node, styles.nodeEnd]}>
          <View style={[styles.nodeDot, styles.nodeArrivee]} />
          <Text style={[styles.city, styles.cityEnd]}>{arrivee}</Text>
        </View>
      </View>

      <Text style={styles.cargo}>{marchandise}</Text>
      {chauffeur ? <Text style={styles.driver}>Chauffeur · {chauffeur}</Text> : null}
    </Surface>
  )
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ref: { fontFamily: fontFamily.mono, fontSize: fontSize.sm, color: colors.muted },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xs, textTransform: "capitalize" },
  corridor: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm },
  node: { flex: 1 },
  nodeEnd: { alignItems: "flex-end" },
  nodeDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 6 },
  nodeDepart: { backgroundColor: colors.primary },
  nodeArrivee: { backgroundColor: colors.accent },
  city: { fontFamily: fontFamily.heading, fontSize: fontSize.base, color: colors.foreground },
  cityEnd: { textAlign: "right" },
  line: { flex: 1.2, alignItems: "center", justifyContent: "center", position: "relative", height: 40 },
  lineDash: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 18,
    height: 2,
    backgroundColor: colors.border,
  },
  truck: { fontSize: 18, backgroundColor: colors.surface, paddingHorizontal: 4 },
  cargo: { fontFamily: fontFamily.bodyMedium, fontSize: fontSize.sm, color: colors.foreground },
  driver: { fontFamily: fontFamily.body, fontSize: fontSize.xs, color: colors.muted },
})
