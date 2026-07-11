import { View, Pressable, Text, StyleSheet } from "react-native"
import { usePathname, useRouter } from "expo-router"
import { colors, fontFamily, fontSize, radius, shadow, spacing } from "../tokens"

export interface DockItem {
  key: string
  label: string
  href: string
  icon: string
  prominent?: boolean
}

interface FieldDockProps {
  items: DockItem[]
}

/** Dock terrain — navigation chauffeur, inspiré Floating Dock (Aceternity) */
export function FieldDock({ items }: FieldDockProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <View style={styles.wrap}>
      <View style={styles.dock}>
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Pressable
              key={item.key}
              onPress={() => router.push(item.href as never)}
              style={[styles.item, item.prominent && styles.itemProminent, active && styles.itemActive]}
            >
              <Text style={[styles.icon, item.prominent && styles.iconProminent]}>{item.icon}</Text>
              {!item.prominent && (
                <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
              )}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
  },
  dock: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(0, 86, 59, 0.12)",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...shadow.dock,
  },
  item: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    minWidth: 52,
  },
  itemProminent: {
    backgroundColor: colors.accent,
    marginTop: -20,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xl,
    minWidth: 64,
    ...shadow.card,
  },
  itemActive: { backgroundColor: "rgba(0, 86, 59, 0.08)" },
  icon: { fontSize: 20 },
  iconProminent: { fontSize: 26 },
  label: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.xs,
    color: colors.muted,
    marginTop: 2,
  },
  labelActive: { color: colors.primary },
})
