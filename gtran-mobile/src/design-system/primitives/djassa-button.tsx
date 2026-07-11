import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from "react-native"
import { colors, fontFamily, fontSize, radius, spacing } from "../tokens"

type Variant = "primary" | "accent" | "ghost" | "outline"

interface DjassaButtonProps {
  label: string
  onPress?: () => void
  variant?: Variant
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
}

export function DjassaButton({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled,
  style,
}: DjassaButtonProps) {
  const isDisabled = disabled || loading

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "ghost" || variant === "outline" ? colors.primary : "#fff"} />
      ) : (
        <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 15,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
  disabled: { opacity: 0.5 },
  label: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.base,
    letterSpacing: 0.3,
  },
})

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  accent: { backgroundColor: colors.accent },
  ghost: { backgroundColor: "transparent" },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
})

const labelStyles = StyleSheet.create({
  primary: { color: colors.primaryForeground },
  accent: { color: colors.accentForeground },
  ghost: { color: colors.primary },
  outline: { color: colors.primary },
})
