import { View, Text, StyleSheet } from "react-native"

export default function TrackingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suivi GPS</Text>
      <Text style={styles.subtitle}>Position temps réel, itinéraire — à implémenter</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666" },
})
