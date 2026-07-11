import { View, Text, StyleSheet } from "react-native"
import { useLocalSearchParams } from "expo-router"

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mission {id}</Text>
      <Text style={styles.subtitle}>Détail, étapes, actions chauffeur — à implémenter</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666" },
})
