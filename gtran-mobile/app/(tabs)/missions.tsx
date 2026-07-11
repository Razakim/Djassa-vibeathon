import { View, Text, StyleSheet } from "react-native"

export default function MissionsTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Missions</Text>
      <Text style={styles.subtitle}>Liste et suivi des missions — à implémenter</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666" },
})
