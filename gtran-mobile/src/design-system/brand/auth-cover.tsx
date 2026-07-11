import { ReactNode } from "react"
import { StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors } from "../tokens"

interface AuthCoverProps {
  children: ReactNode
}

/** Panneau brandé onboarding — émeraude + blobs orange, motif corridor */
export function AuthCover({ children }: AuthCoverProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.primary, "#003D29", colors.primary]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.blobOrange} />
      <View style={styles.blobGold} />
      <View style={styles.watermark}>
        <View style={styles.watermarkD} />
      </View>
      <View style={styles.corridor}>
        {CORRIDOR_DOTS.map((dot, i) => (
          <View key={i} style={[styles.dot, { left: dot.x, top: dot.y, opacity: dot.o }]} />
        ))}
      </View>
      {children}
    </View>
  )
}

const CORRIDOR_DOTS = [
  { x: "8%", y: "22%", o: 0.15 },
  { x: "22%", y: "28%", o: 0.25 },
  { x: "38%", y: "35%", o: 0.35 },
  { x: "55%", y: "42%", o: 0.45 },
  { x: "72%", y: "50%", o: 0.35 },
  { x: "88%", y: "58%", o: 0.2 },
]

const styles = StyleSheet.create({
  root: { flex: 1, overflow: "hidden" },
  blobOrange: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(226, 88, 34, 0.22)",
    bottom: -80,
    left: -60,
  },
  blobGold: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 191, 0, 0.12)",
    top: -40,
    right: -30,
  },
  watermark: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.04,
  },
  watermarkD: {
    width: 200,
    height: 240,
    borderWidth: 24,
    borderColor: "#fff",
    borderRadius: 40,
    transform: [{ rotate: "-8deg" }],
  },
  corridor: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  dot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
})
