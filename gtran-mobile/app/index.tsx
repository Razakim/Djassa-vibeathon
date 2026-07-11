import { Redirect } from "expo-router"
import { useAuth } from "@/lib/auth"
import { resolveHomeRoute, resolvePersona } from "@/navigation/resolve-home"

export default function Index() {
  const { user, bootstrapped } = useAuth()

  if (!bootstrapped) return null

  const route = resolveHomeRoute(resolvePersona(user))
  return <Redirect href={route as never} />
}
