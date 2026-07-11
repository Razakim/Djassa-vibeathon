import { useState } from "react"
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  Animated,
} from "react-native"
import { colors, fontFamily, fontSize, radius, spacing } from "../tokens"

interface GooeyFieldProps extends TextInputProps {
  label: string
  hint?: string
}

/** Champ signature Djassa — halo émeraude/orange au focus (équivalent mobile du GooeyInput web) */
export function GooeyField({ label, hint, style, onFocus, onBlur, ...props }: GooeyFieldProps) {
  const [focused, setFocused] = useState(false)
  const glow = useState(() => new Animated.Value(0))[0]

  const animateGlow = (to: number) => {
    Animated.timing(glow, { toValue: to, duration: 200, useNativeDriver: false }).start()
  }

  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  })

  const shadowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.35],
  })

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        style={[
          styles.fieldWrap,
          {
            borderColor,
            shadowOpacity,
          },
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.muted}
          onFocus={(e) => {
            setFocused(true)
            animateGlow(1)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            animateGlow(0)
            onBlur?.(e)
          }}
          {...props}
        />
        {focused && <View style={styles.accentBar} />}
      </Animated.View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  fieldWrap: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    overflow: "hidden",
  },
  input: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.foreground,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  accentBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.accent,
  },
  hint: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.muted,
  },
})
