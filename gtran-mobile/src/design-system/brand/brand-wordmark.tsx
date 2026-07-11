import { View, Text, StyleSheet } from "react-native"
import { BrandMark } from "./brand-mark"
import { colors, fontFamily, fontSize, letterSpacing } from "../tokens"

interface BrandWordmarkProps {
  size?: "sm" | "md" | "lg"
  light?: boolean
}

export function BrandWordmark({ size = "md", light = false }: BrandWordmarkProps) {
  const markSize = size === "sm" ? 28 : size === "md" ? 36 : 44
  const titleSize = size === "sm" ? fontSize.xl : size === "md" ? fontSize["2xl"] : fontSize["3xl"]

  return (
    <View style={styles.row}>
      <View style={[styles.markWrap, light && styles.markWrapLight]}>
        <BrandMark size={markSize} variant={light ? "white" : "metal"} />
      </View>
      <View>
        <Text style={[styles.title, { fontSize: titleSize }, light && styles.titleLight]}>
          Djassa<Text style={styles.accent}>OS</Text>
        </Text>
        <Text style={[styles.tagline, light && styles.taglineLight]}>LOGISTICS HUB — CI</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  markWrap: {
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 14,
    ...StyleSheet.flatten({
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    }),
  },
  markWrapLight: { backgroundColor: "rgba(255,255,255,0.12)" },
  title: {
    fontFamily: fontFamily.display,
    color: colors.foreground,
    letterSpacing: letterSpacing.tight,
    textTransform: "uppercase",
    lineHeight: 28,
  },
  titleLight: { color: colors.primaryForeground },
  accent: { color: colors.accent },
  tagline: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.xs,
    letterSpacing: letterSpacing.brand,
    color: colors.muted,
    marginTop: 2,
  },
  taglineLight: { color: "rgba(255,255,255,0.45)" },
})
