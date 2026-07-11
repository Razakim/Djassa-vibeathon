import { View, Text, StyleSheet } from "react-native"
import { useLocalSearchParams } from "expo-router"

export default function DeliveryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Livraison {id}</Text>
      <Text style={styles.subtitle}>Photo, signature électronique, confirmation — à implémenter</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666" },
})
