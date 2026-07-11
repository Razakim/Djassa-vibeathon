import { View, Text, StyleSheet } from "react-native"

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gtran</Text>
      <Text style={styles.subtitle}>Connexion — à implémenter</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666" },
})
