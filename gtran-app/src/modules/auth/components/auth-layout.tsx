import type { ReactNode } from "react"
import { motion } from "motion/react"
import { MapPin, Shield, BarChart3, Wifi } from "lucide-react"
import { BrandLogo } from "@/components/shared/brand-logo"

const FEATURES = [
  { icon: MapPin, text: "Suivi GPS temps réel — corridors Abidjan-Bamako, Abidjan-Ouaga" },
  { icon: BarChart3, text: "Pilotage financier, marge par camion/chauffeur/client" },
  { icon: Wifi, text: "Paiements Mobile Money (Wave, Orange, CinetPay)" },
  { icon: Shield, text: "Conformité multi-agences, RLS Supabase intégré" },
]

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen bg-[#FAF9F6]">
      {/* Left panel — Ivorian brand panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-ivory-emerald p-12 text-white relative overflow-hidden"
      >
        {/* Decorative blobs */}
        <motion.div
          className="absolute -top-24 -right-24 size-96 rounded-full bg-white/5 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-24 -left-24 size-80 rounded-full bg-ivory-orange/20 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        {/* Watermark pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
          <span className="text-[28rem] font-inter font-black tracking-tighter leading-none">D</span>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-lg">
            <BrandLogo variant="mark" size={36} className="text-ivory-emerald" />
          </div>
          <div>
            <p className="text-2xl font-inter font-black uppercase tracking-tighter leading-none">
              Djassa<span className="text-ivory-orange">OS</span>
            </p>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mt-0.5">
              Logistics Hub — Côte d'Ivoire
            </p>
          </div>
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-inter font-black uppercase tracking-tight leading-tight text-white">
              Pilotez votre flotte
              <br />
              <span className="text-ivory-orange">depuis un seul endroit.</span>
            </h2>
            <p className="mt-4 text-base text-white/60 max-w-md font-medium leading-relaxed">
              Missions, chauffeurs, paiements Mobile Money, maintenance — tout centralisé pour les transporteurs d'Afrique de l'Ouest.
            </p>
          </div>

          <ul className="space-y-4">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 mt-0.5">
                  <f.icon className="size-4 text-ivory-orange" />
                </div>
                <span className="text-sm text-white/80 font-medium leading-relaxed">{f.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-white/30">
          © 2026 Djassa — Plateforme de transport & logistique d'Afrique de l'Ouest
        </p>
      </motion.div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile logo */}
          <div className="flex flex-col items-center gap-2 text-center lg:hidden">
            <div className="bg-ivory-emerald p-2.5 rounded-2xl shadow-lg">
              <BrandLogo variant="mark" size={36} className="text-white filter brightness-0 invert" />
            </div>
            <span className="text-2xl font-inter font-black uppercase tracking-tighter">
              Djassa<span className="text-ivory-orange">OS</span>
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl font-inter font-black uppercase tracking-tight text-zinc-950">{title}</h1>
            <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  )
}
