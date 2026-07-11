import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Heading, Surface, colors, fontFamily, fontSize, spacing } from "@/design-system"

const MESSAGES = [
  { from: "Dispatch Abidjan", text: "Client confirmé pour déchargement 14h.", time: "10:32", unread: true },
  { from: "Maintenance", text: "Vidange prévue à votre retour — garage Plateau.", time: "Hier", unread: false },
]

export default function MessagesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Heading level={2}>Radio flotte</Heading>
      <Text style={styles.sub}>Consignes et messages dispatch</Text>
      {MESSAGES.map((m) => (
        <Surface key={m.text} elevated style={m.unread ? styles.unread : undefined}>
          <View style={styles.row}>
            <Text style={styles.from}>{m.from}</Text>
            <Text style={styles.time}>{m.time}</Text>
          </View>
          <Text style={styles.body}>{m.text}</Text>
        </Surface>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  sub: { fontFamily: fontFamily.body, fontSize: fontSize.sm, color: colors.muted, marginTop: -8 },
  unread: { borderColor: colors.primary, borderWidth: 1.5 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  from: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm, color: colors.primary },
  time: { fontFamily: fontFamily.body, fontSize: fontSize.xs, color: colors.muted },
  body: { fontFamily: fontFamily.body, fontSize: fontSize.sm, color: colors.foreground, lineHeight: 20 },
})
