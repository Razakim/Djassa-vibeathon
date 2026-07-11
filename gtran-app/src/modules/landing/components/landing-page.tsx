import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { 
  ShieldCheck, 
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/shared/brand-logo"

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#FAF9F6] text-zinc-900 font-dm-sans min-h-screen selection:bg-ivory-orange selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="bg-ivory-emerald p-1.5 rounded-xl">
            <BrandLogo variant="mark" size={32} className="text-white filter brightness-0 invert" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-inter font-black uppercase tracking-tighter leading-none text-zinc-950">
              Djassa<span className="text-ivory-orange">OS</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">Logistics Hub</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-zinc-600">
          <a href="#features" className="hover:text-ivory-emerald transition-colors">Fonctionnalités</a>
          <a href="#stats" className="hover:text-ivory-emerald transition-colors">Performance & ROI</a>
          <a href="#about" className="hover:text-ivory-emerald transition-colors">Notre Vision</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/login")}
            className="hidden sm:block text-xs font-black uppercase tracking-widest text-zinc-700 hover:text-ivory-orange transition-colors"
          >
            Se Connecter
          </button>
          <Button 
            onClick={() => navigate("/register")}
            className="bg-ivory-emerald text-white rounded-2xl px-6 h-11 text-xs font-black uppercase tracking-widest hover:bg-ivory-emerald/90 transition-all shadow-md active:scale-95"
          >
            Créer un compte
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row min-h-screen pt-24 border-b border-zinc-200">
        <div className="lg:w-[55%] p-6 md:p-20 flex flex-col justify-center bg-white relative">
          <div className="absolute top-10 left-10 opacity-[0.02] pointer-events-none text-[20rem] font-inter font-black leading-none select-none">
            DJ
          </div>
          <div className="relative z-10 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/50 rounded-full mb-6">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">L'infrastructure Digitale du Transport Ivoirien</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-inter font-black uppercase leading-[0.95] mb-8 tracking-tighter text-zinc-950">
              LE SYSTÈME <br /> D'EXPLOITATION <br /> <span className="text-ivory-emerald">DU TRANSPORT</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-10 font-medium leading-relaxed text-zinc-600">
              Centralisez votre flotte, vos chauffeurs, vos feuilles de route et vos règlements Mobile Money. Dites adieu au désordre de WhatsApp et d'Excel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate("/register")}
                className="bg-ivory-orange hover:bg-ivory-orange/90 text-white px-10 h-16 text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
              >
                Commencer l'expérience
                <ArrowRight className="ml-2 size-4" strokeWidth={3} />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/login")}
                className="border-2 border-zinc-200 rounded-2xl h-16 px-10 text-xs font-black uppercase tracking-widest hover:bg-zinc-50"
              >
                Se connecter (Démo)
              </Button>
            </div>
          </div>
        </div>
        
        <div className="lg:w-[45%] relative bg-zinc-900 overflow-hidden min-h-[400px] lg:min-h-0">
          <video 
            src="https://videos.pexels.com/video-files/28744906/12461966_640_360_24fps.mp4" 
            poster="https://images.pexels.com/videos/28744906/cargo-cargo-trailers-cargo-transport-commercial-truck-28744906.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200" 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
            <div className="bg-white/90 backdrop-blur-md text-zinc-950 p-4 rounded-2xl border border-white/20 flex flex-col gap-1 shadow-lg text-left">
              <span className="text-[9px] font-black tracking-widest uppercase text-zinc-400">CORRIDOR LIVE</span>
              <span className="text-xs font-bold uppercase tracking-tight text-ivory-emerald">Abidjan ➔ Yamoussoukro</span>
            </div>
            <div className="bg-zinc-950/80 backdrop-blur-md text-white p-4 rounded-2xl border border-white/5 flex flex-col gap-1 shadow-lg text-right">
              <span className="text-[9px] font-black tracking-widest uppercase text-white/40">SUIVI LIVE</span>
              <div className="flex items-center gap-2">
                <span className="size-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-xs font-black uppercase">Flotte Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="border-b border-zinc-200 py-6 bg-zinc-950 text-white overflow-hidden whitespace-nowrap relative">
        <div className="flex animate-marquee">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex shrink-0">
              <span className="text-2xl font-inter font-black uppercase mx-12 flex items-center gap-12 tracking-wider">
                FLOTTE <span className="text-zinc-800">•</span> CHAUFFEURS <span className="text-zinc-800">•</span> MISSIONS <span className="text-zinc-800">•</span> PAYEMENTS MOBILE MONEY <span className="text-zinc-800">•</span> COMPTABILITÉ <span className="text-zinc-800">•</span> VISITE TECHNIQUE <span className="text-zinc-800">•</span> RENTABILITÉ
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Sections */}
      <section id="features" className="flex flex-col bg-white">
        {/* 01 - Fleet */}
        <div className="border-b border-zinc-100 group cursor-default hover:bg-zinc-50/50 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center p-8 md:p-20 gap-12 md:gap-24">
            <div className="text-7xl md:text-9xl font-inter font-black text-zinc-100 group-hover:text-ivory-emerald transition-colors duration-500 leading-none select-none">01</div>
            <div className="flex-1 text-left">
              <div className="text-[10px] font-black tracking-[0.3em] uppercase mb-3 text-ivory-orange">EXCELLENCE OPÉRATIONNELLE</div>
              <h3 className="text-3xl md:text-5xl font-inter font-black uppercase mb-6 tracking-tight text-zinc-950">Gestion de Flotte</h3>
              <p className="text-base md:text-lg max-w-xl text-zinc-600 leading-relaxed">
                Suivi GPS en temps réel, alertes de maintenance (vidanges, pneumatiques), consommation de carburant et conformité administrative (assurances, visites techniques).
              </p>
            </div>
            <div className="w-full lg:w-[400px] aspect-video relative rounded-3xl overflow-hidden border border-zinc-200 shadow-md group-hover:shadow-xl transition-all duration-500">
               <img 
                 src="https://images.pexels.com/photos/20097991/pexels-photo-20097991.jpeg?auto=compress&cs=tinysrgb&w=800&q=80" 
                 alt="Flotte de Camions" 
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
               />
            </div>
          </div>
        </div>

        {/* 02 - Drivers */}
        <div className="border-b border-zinc-100 group cursor-default hover:bg-zinc-50/50 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center p-8 md:p-20 gap-12 md:gap-24">
            <div className="text-7xl md:text-9xl font-inter font-black text-zinc-100 group-hover:text-ivory-emerald transition-colors duration-500 leading-none select-none">02</div>
            <div className="flex-1 text-left">
              <div className="text-[10px] font-black tracking-[0.3em] uppercase mb-3 text-ivory-orange">CAPITAL HUMAIN</div>
              <h3 className="text-3xl md:text-5xl font-inter font-black uppercase mb-6 tracking-tight text-zinc-950">Performance Chauffeurs</h3>
              <p className="text-base md:text-lg max-w-xl text-zinc-600 leading-relaxed">
                Mesurez la ponctualité, gérez les contrats et suivez les scores de sécurité pour encourager une conduite éco-responsable et réduire vos coûts de carburant.
              </p>
            </div>
            <div className="w-full lg:w-[400px] aspect-video rounded-3xl p-8 flex flex-col justify-between bg-zinc-950 text-white shadow-md group-hover:shadow-xl transition-all duration-500">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono opacity-50">CHAUFFEUR: DJ-942</span>
                <span className="px-3 py-1 bg-emerald-500 text-zinc-950 text-[9px] font-black uppercase tracking-wider rounded-full">EN MISSION</span>
              </div>
              <div className="text-left">
                <div className="text-2xl font-inter font-black tracking-tight mb-4 text-white">AMADOU KOUASSI</div>
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "94%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "circOut" }}
                    className="bg-ivory-orange h-full rounded-full" 
                  />
                </div>
                <div className="flex justify-between mt-2.5 text-[9px] font-black tracking-widest opacity-60 uppercase">
                  <span>Score Sécurité</span>
                  <span>94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 03 - Missions */}
        <div className="border-b border-zinc-100 group cursor-default hover:bg-zinc-50/50 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center p-8 md:p-20 gap-12 md:gap-24">
            <div className="text-7xl md:text-9xl font-inter font-black text-zinc-100 group-hover:text-ivory-emerald transition-colors duration-500 leading-none select-none">03</div>
            <div className="flex-1 text-left">
              <div className="text-[10px] font-black tracking-[0.3em] uppercase mb-3 text-ivory-orange">DÉMATÉRIALISATION</div>
              <h3 className="text-3xl md:text-5xl font-inter font-black uppercase mb-6 tracking-tight text-zinc-950">Suivi des Missions</h3>
              <p className="text-base md:text-lg max-w-xl text-zinc-600 leading-relaxed">
                De la feuille de route à la confirmation de livraison. Suivez vos trajets en temps réel, collectez les preuves de livraison et facturez immédiatement.
              </p>
            </div>
            <div className="w-full lg:w-[400px] rounded-3xl p-8 bg-zinc-50 border border-zinc-200/60 shadow-md group-hover:shadow-xl transition-all duration-500 text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <ShieldCheck className="size-6 text-emerald-600" />
                </div>
                <span className="font-inter font-black text-lg text-zinc-900">LIVRAISON CONFIRMÉE</span>
              </div>
              <div className="space-y-4 text-xs border-t border-zinc-200/60 pt-6 font-bold uppercase tracking-wider text-zinc-500">
                <div className="flex justify-between">
                  <span>Origine</span>
                  <span className="text-zinc-900 font-black">PORT D'ABIDJAN</span>
                </div>
                <div className="flex justify-between">
                  <span>Destination</span>
                  <span className="text-zinc-900 font-black">YAMOUSSOUKRO</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Règlement</span>
                  <span className="text-emerald-600 font-black px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-100">WAVE PAYÉ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI & Impact Metrics */}
      <section id="stats" className="py-24 bg-zinc-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="text-[10px] font-black tracking-[0.4em] uppercase mb-4 text-ivory-orange">IMPACT FINANCIER & PERFORMANCE</div>
          <h2 className="text-4xl md:text-6xl font-inter font-black uppercase mb-20 tracking-tighter leading-none text-zinc-950">
            CONTRÔLE OPÉRATIONNEL <br /> MARGES ACCRUES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { val: "+32%", label: "Marge Opérationnelle", desc: "Augmentation moyenne de rentabilité constatée après 6 mois d'utilisation de DjassaOS." },
              { val: "0", label: "Perte de Documents", desc: "Toutes vos lettres de voiture, bons de livraison et factures sont archivés dans le Cloud.", isGold: true },
              { val: "100%", label: "Taux de Conformité", desc: "Suivi proactif et alertes automatiques sur les dates d'expiration administratives." }
            ].map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`p-10 rounded-[2rem] border border-zinc-200/60 bg-white text-zinc-900 text-left hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ${m.isGold ? 'border-ivory-emerald/20 shadow-emerald-50/50 shadow-lg' : ''}`}
              >
                <div className="text-5xl md:text-6xl font-inter font-black text-zinc-950 mb-3 tracking-tighter">{m.val}</div>
                <div className={`text-sm font-black uppercase tracking-wider mb-4 ${m.isGold ? 'text-ivory-emerald' : 'text-ivory-orange'}`}>{m.label}</div>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-zinc-950 text-white py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <img src="https://cdn.jsdelivr.net/npm/game-icons-transparent@latest/svgs/lorc/waves.svg" className="w-full h-full object-cover scale-150" alt="" />
        </div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-inter font-black uppercase leading-tight mb-8 tracking-tighter">
            OPTIMISEZ VOS OPÉRATIONS <br /> DE TRANSPORT DÈS AUJOURD'HUI
          </h2>
          <p className="text-white/60 text-base md:text-lg mb-12 max-w-xl mx-auto">
            Rejoignez les transporteurs ivoiriens de pointe et gérez vos véhicules avec une visibilité totale.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => navigate("/register")}
              className="bg-ivory-orange hover:bg-ivory-orange/90 text-white px-10 h-14 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg"
            >
              Créer mon espace
            </Button>
            <Button 
              onClick={() => navigate("/login")}
              className="bg-white/10 hover:bg-white/20 text-white px-10 h-14 text-xs font-black uppercase tracking-widest rounded-2xl border border-white/10"
            >
              Essayer la démo
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="p-8 md:p-16 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-ivory-emerald p-1.5 rounded-xl">
              <BrandLogo variant="mark" size={28} className="text-white filter brightness-0 invert" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-inter font-black uppercase tracking-tighter leading-none text-zinc-950">Djassa<span className="text-ivory-orange">OS</span></span>
              <span className="text-[8px] font-bold tracking-widest text-zinc-400 uppercase text-left">Le Système du Transport Routier</span>
            </div>
          </div>
          
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            © 2026 DJASSA INFRASTRUCTURE. TOUS DROITS RÉSERVÉS.
          </div>
        </div>
      </footer>
      
      {/* Global Marquee Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
