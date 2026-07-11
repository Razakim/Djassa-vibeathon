/** Palette DjassaOS — miroir exact de gtran-app/globals.css */
export const palette = {
  ivory: {
    emerald: "#00563B",
    emeraldLight: "#007A53",
    orange: "#E25822",
    orangeVivid: "#FF6B2C",
    gold: "#FFBF00",
    white: "#F8F9FA",
    cream: "#FAF9F6",
  },
  semantic: {
    success: "#00563B",
    warning: "#FFBF00",
    danger: "#C41E3A",
    info: "#1E4D8C",
  },
  neutral: {
    ink: "#1A1A1A",
    slate: "#52525B",
    mist: "#A1A1AA",
    line: "#E4E4E7",
    snow: "#FFFFFF",
  },
} as const

export const colors = {
  background: palette.ivory.cream,
  surface: palette.neutral.snow,
  foreground: palette.neutral.ink,
  muted: palette.neutral.slate,
  border: palette.neutral.line,
  primary: palette.ivory.emerald,
  primaryForeground: palette.neutral.snow,
  accent: palette.ivory.orange,
  accentForeground: palette.neutral.snow,
  gold: palette.ivory.gold,
  sidebar: palette.ivory.emerald,
} as const
