import { View, Text, StyleSheet, ViewStyle } from "react-native"
import { colors, fontFamily, fontSize, letterSpacing, radius, shadow, spacing } from "../tokens"

interface SurfaceProps {
  children: React.ReactNode
  elevated?: boolean
  style?: ViewStyle
}

export function Surface({ children, elevated, style }: SurfaceProps) {
  return <View style={[styles.base, elevated && styles.elevated, style]}>{children}</View>
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  elevated: { ...shadow.card },
})

interface HeadingProps {
  children: string
  level?: 1 | 2 | 3
  accent?: string
}

export function Heading({ children, level = 1, accent }: HeadingProps) {
  const size = level === 1 ? fontSize["3xl"] : level === 2 ? fontSize["2xl"] : fontSize.xl
  return (
    <Text style={[headingStyles.base, { fontSize: size }]}>
      {children}
      {accent ? <Text style={headingStyles.accent}>{accent}</Text> : null}
    </Text>
  )
}

const headingStyles = StyleSheet.create({
  base: {
    fontFamily: fontFamily.display,
    color: colors.foreground,
    textTransform: "uppercase",
    letterSpacing: letterSpacing.tight,
    lineHeight: 36,
  },
  accent: { color: colors.accent },
})
