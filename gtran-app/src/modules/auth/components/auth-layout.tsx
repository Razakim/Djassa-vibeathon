import { type ReactNode } from "react"
import { motion } from "motion/react"
import { MapPin, Shield, BarChart3 } from "lucide-react"
import { BrandLogo } from "@/components/shared/brand-logo"

const FEATURES = [
  { icon: MapPin, text: "Suivi GPS temps réel de votre flotte" },
  { icon: BarChart3, text: "Pilotage financier et rentabilité" },
  { icon: Shield, text: "Multi-agences sécurisé" },
]

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 text-white relative overflow-hidden"
      >
        <motion.div
          className="absolute -top-20 -right-20 size-80 rounded-full bg-blue-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 size-80 rounded-full bg-violet-500/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <BrandLogo variant="mark" size={44} />
          <div>
            <p className="text-xl font-bold">Djassa</p>
            <p className="text-sm text-white/60">Operating System du transport</p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Pilotez votre flotte
              <br />
              <span className="text-blue-400">depuis un seul endroit</span>
            </h2>
            <p className="mt-4 text-lg text-white/70 max-w-md">
              Missions, chauffeurs, paiements, maintenance — tout centralisé pour les entreprises de transport d&apos;Afrique de l&apos;Ouest.
            </p>
          </div>

          <ul className="space-y-4">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="size-4 text-blue-300" />
                </div>
                <span className="text-white/80">{f.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-white/40">
          &copy; 2026 Djassa — Plateforme de transport & logistique
        </p>
      </motion.div>

      <div className="flex flex-1 items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
            <BrandLogo variant="full" size={48} className="lg:hidden" />
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  )
}
