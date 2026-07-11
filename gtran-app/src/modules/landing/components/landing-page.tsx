import React from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import { 
  ArrowRight,
  Zap,
  Globe,
  BarChart3,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  Map,
  Users2,
  Lock,
  Truck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/shared/brand-logo"

export function LandingPage(): JSX.Element {
  const navigate = useNavigate()
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1, 
        ease: [0.19, 1, 0.22, 1] 
      } 
    }
  }

  return (
    <div className="bg-[#FAF9F6] text-zinc-900 font-dm-sans min-h-screen selection:bg-ivory-orange selection:text-white overflow-x-hidden antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-zinc-200/40 bg-white/60 backdrop-blur-2xl px-6 md:px-12 py-4 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <div className="bg-ivory-emerald p-2 rounded-xl shadow-[0_8px_16px_-6px_rgba(0,86,59,0.3)]">
            <BrandLogo variant="mark" size={26} className="text-white filter brightness-0 invert" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-plus-jakarta font-extrabold uppercase tracking-tighter leading-none text-zinc-950">
              Djassa<span className="text-ivory-orange">OS</span>
            </span>
            <span className="text-[8px] font-bold tracking-[0.25em] text-zinc-400 uppercase text-left">Expertise Logistique</span>
          </div>
        </motion.div>
        
        <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          <a href="#plateforme" className="hover:text-ivory-emerald transition-all duration-300 relative group">
            Plateforme
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ivory-emerald group-hover:w-full transition-all duration-300" />
          </a>
          <a href="#solutions" className="hover:text-ivory-emerald transition-all duration-300 relative group">
            Solutions
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ivory-emerald group-hover:w-full transition-all duration-300" />
          </a>
          <a href="#impact" className="hover:text-ivory-emerald transition-all duration-300 relative group">
            Impact ROI
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ivory-emerald group-hover:w-full transition-all duration-300" />
          </a>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-6"
        >
          <button 
            onClick={() => navigate("/login")}
            className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600 hover:text-ivory-orange transition-colors"
          >
            Se Connecter
          </button>
          <Button 
            onClick={() => navigate("/register")}
            className="bg-ivory-emerald text-white rounded-full px-8 h-11 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-950 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 border-none"
          >
            Démarrer
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-ivory-emerald/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-ivory-orange/5 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-zinc-100 border border-zinc-200/60 rounded-full mb-10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ivory-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ivory-orange"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">L'infrastructure Digitale du Transport Ivoirien</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants} 
            className="text-6xl md:text-[7.5rem] font-plus-jakarta font-extrabold uppercase leading-[0.85] mb-10 tracking-[-0.04em] text-zinc-950"
          >
            L'EXCELLENCE <br /> LOGISTIQUE. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-ivory-emerald via-emerald-700 to-ivory-emerald bg-[length:200%_auto] animate-gradient-text">TOUT SIMPLEMENT.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants} 
            className="text-lg md:text-2xl mb-14 font-medium leading-relaxed text-zinc-500 max-w-3xl mx-auto tracking-tight"
          >
            DjassaOS est le système d'exploitation de classe mondiale conçu pour connecter Abidjan au reste du monde avec une précision algorithmique.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => navigate("/register")}
              className="bg-ivory-orange hover:bg-zinc-950 text-white px-12 h-16 text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_20px_40px_-10px_rgba(226,88,34,0.3)] transition-all active:scale-95 group border-none"
            >
              Démarrer l'expérience
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/login")}
              className="border border-zinc-200 bg-white/40 backdrop-blur-md rounded-full h-16 px-12 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:border-zinc-300 transition-all shadow-sm"
            >
              Essayer la démo
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero Mockup with Scroll Interaction */}
        <motion.div 
          style={{ opacity, scale }}
          ref={targetRef}
          className="relative mt-24 w-full max-w-7xl mx-auto px-4 perspective-1000"
        >
          <div className="relative rounded-[3rem] overflow-hidden border-[1px] border-zinc-200/50 shadow-[0_100px_80px_-40px_rgba(0,0,0,0.15)] bg-white p-2">
            <div className="rounded-[2.4rem] overflow-hidden aspect-[16/9] relative bg-zinc-950 group">
              <img 
                src="https://images.pexels.com/photos/16663692/pexels-photo-16663692.jpeg" 
                alt="DjassaOS Interface" 
                className="w-full h-full object-cover opacity-90 scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12 text-left">
                <div className="flex items-center gap-4 mb-3">
                  <div className="px-3 py-1 bg-ivory-emerald text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full text-left">LIVE FLOTTE</div>
                  <span className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] text-left">Réseau National</span>
                </div>
                <h2 className="text-white text-3xl font-plus-jakarta font-extrabold uppercase tracking-tight text-left">Corridor Abidjan - San Pédro</h2>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Partners Marquee */}
      <div className="py-20 bg-white border-y border-zinc-100/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 bottom-0 w-64 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute top-0 right-0 bottom-0 w-64 bg-gradient-to-l from-white to-transparent z-10" />
        
        <div className="flex animate-marquee opacity-20 whitespace-nowrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex shrink-0 items-center gap-24 mx-12">
              <span className="text-3xl font-plus-jakarta font-black tracking-tighter uppercase">Port Autonome d'Abidjan</span>
              <span className="text-3xl font-plus-jakarta font-black tracking-tighter uppercase">Bolloré Logistics</span>
              <span className="text-3xl font-plus-jakarta font-black tracking-tighter uppercase">Sitarail</span>
              <span className="text-3xl font-plus-jakarta font-black tracking-tighter uppercase">CMA CGM Africa</span>
              <span className="text-3xl font-plus-jakarta font-black tracking-tighter uppercase">Wave Mobile Money</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bento Grid Features */}
      <section id="plateforme" className="py-40 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold tracking-[0.5em] uppercase mb-6 text-ivory-orange text-center"
          >
            La Puissance de DjassaOS
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-plus-jakarta font-extrabold uppercase tracking-[-0.03em] text-zinc-950 leading-[0.95] text-center"
          >
            CONÇU POUR L'ÉLITE <br /><span className="text-ivory-emerald">LOGISTIQUE.</span>
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[900px]">
          {/* Real-time Tracking */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="md:col-span-8 bg-white border border-zinc-200/50 rounded-[3.5rem] p-12 flex flex-col justify-between overflow-hidden relative group shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700"
          >
            <div className="relative z-10 max-w-md text-left">
              <div className="bg-emerald-50 text-ivory-emerald p-4 rounded-[1.5rem] w-fit mb-8 shadow-sm">
                <Map className="size-7" />
              </div>
              <h4 className="text-4xl font-plus-jakarta font-extrabold uppercase tracking-tight mb-6">Suivi Temps Réel</h4>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                Visualisez chaque mouvement de votre flotte sur une carte interactive haute précision. Géofencing intelligent et alertes instantanées.
              </p>
            </div>
            <div className="absolute bottom-[-5%] right-[-5%] w-[70%] h-[55%] bg-zinc-50 rounded-tl-[4rem] border-t border-l border-zinc-100 p-8 shadow-2xl translate-y-8 translate-x-8 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-[1.2s] ease-[0.19,1,0.22,1]">
               <div className="flex flex-col gap-5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center gap-5 bg-white p-4 rounded-2xl shadow-sm border border-zinc-100/50">
                      <div className="size-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                        <Truck className="size-5 text-zinc-400" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2.5 bg-zinc-100 rounded-full w-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${40 + i * 15}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="bg-ivory-emerald h-full"
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-left">
                          <span>Route : A1-0{i}</span>
                          <span>{85 + i}% Optimisé</span>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>

          {/* ROI Metric */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -10 }}
            className="md:col-span-4 bg-zinc-950 text-white border border-zinc-800 rounded-[3.5rem] p-12 flex flex-col justify-between shadow-2xl transition-all duration-700"
          >
            <div className="bg-orange-500/20 text-ivory-orange p-5 rounded-[1.5rem] w-fit mb-8 shadow-lg">
              <BarChart3 className="size-7" />
            </div>
            <div className="text-left">
              <h4 className="text-4xl font-plus-jakarta font-extrabold uppercase tracking-tight mb-6 text-left">ROI Immédiat</h4>
              <p className="text-zinc-400 text-lg font-medium mb-10 leading-relaxed text-left">
                Réduisez vos coûts opérationnels de 15% dès le premier cycle.
              </p>
              <div className="space-y-2 text-left">
                <div className="text-7xl font-plus-jakarta font-black text-ivory-orange tracking-tighter text-left">+32%</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 text-left">Marge Opérationnelle</div>
              </div>
            </div>
          </motion.div>

          {/* Payments */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -10 }}
            className="md:col-span-4 bg-[#F2F2F2] border border-zinc-200/50 rounded-[3.5rem] p-12 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-700"
          >
             <div className="bg-gold-500/10 text-ivory-gold p-5 rounded-[1.5rem] w-fit mb-8 shadow-sm">
              <Smartphone className="size-7" />
            </div>
            <div className="text-left">
              <h4 className="text-3xl font-plus-jakarta font-extrabold uppercase tracking-tight mb-6 text-left">Mobile Money</h4>
              <p className="text-zinc-600 text-lg font-medium leading-relaxed text-left">
                Gérez les frais de route et les salaires via Wave, Orange et MTN en un clic.
              </p>
            </div>
          </motion.div>

          {/* Drivers */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -10 }}
            className="md:col-span-8 bg-white border border-zinc-200/50 rounded-[3.5rem] p-12 flex flex-col md:flex-row gap-12 items-center overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700"
          >
            <div className="flex-1 text-left">
              <div className="bg-blue-50 text-blue-600 p-5 rounded-[1.5rem] w-fit mb-8 shadow-sm">
                <Users2 className="size-7" />
              </div>
              <h4 className="text-4xl font-plus-jakarta font-extrabold uppercase tracking-tight mb-6 text-left">Capital Humain</h4>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed text-left">
                Profils chauffeurs augmentés, scores de sécurité et suivi administratif automatisé. 
              </p>
            </div>
            <div className="w-full md:w-1/2 aspect-square rounded-[2.5rem] overflow-hidden group/img">
              <img 
                src="https://images.pexels.com/photos/12706241/pexels-photo-12706241.jpeg" 
                alt="Equipe Logistique" 
                className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 group-hover/img:scale-105 transition-all duration-[1.5s]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Immersive Port Section */}
      <section className="py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="max-w-7xl mx-auto rounded-[4rem] overflow-hidden relative aspect-[21/9] bg-zinc-950 group shadow-2xl"
        >
          <video 
            src="https://videos.pexels.com/video-files/4499159/4499159-sd_960_540_30fps.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover opacity-50 scale-105 group-hover:scale-100 transition-transform duration-[5s] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent flex flex-col items-center justify-center text-center p-12">
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-8xl font-plus-jakarta font-black text-white uppercase tracking-tighter mb-12 leading-[0.9] text-center"
            >
              CONNECTEZ ABIDJAN <br /> AU RESTE DU MONDE.
            </motion.h3>
            <Button className="bg-white text-zinc-950 hover:bg-ivory-orange hover:text-white px-14 h-18 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] border-none transition-all shadow-2xl">
              Découvrir nos solutions portuaires
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-20 mb-32">
            <div className="max-w-2xl text-left">
              <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase mb-6 text-ivory-orange text-left">Performance Mondiale</h2>
              <h3 className="text-5xl md:text-[5.5rem] font-plus-jakarta font-extrabold uppercase tracking-[-0.04em] text-zinc-950 leading-[0.9] text-left">
                L'IMPACT PAR <br /><span className="text-ivory-emerald text-left">LES CHIFFRES.</span>
              </h3>
            </div>
            <div className="lg:pt-20">
               <p className="text-zinc-500 text-xl font-medium max-w-md text-left leading-relaxed">
                Nous ne nous contentons pas de digitaliser. Nous transformons votre structure de coûts pour une rentabilité durable et sans compromis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-20 text-left">
            {[
              { val: "99.9%", label: "Uptime", desc: "Une infrastructure cloud souveraine pour vos opérations 24/7." },
              { val: "25k+", label: "Missions / Mois", desc: "La plateforme capable de piloter les plus grandes flottes d'Afrique." },
              { val: "150M", label: "Économies", desc: "FCFA économisés en moyenne par an par nos clients stratégiques." },
              { val: "0.0s", label: "Latence", desc: "Une interface fluide pensée pour la rapidité d'exécution sur le terrain." }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group relative text-left"
              >
                <div className="text-6xl font-plus-jakarta font-black text-zinc-950 mb-6 group-hover:text-ivory-emerald transition-colors duration-500 tracking-tighter text-left">{stat.val}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-ivory-orange mb-5 text-left">{stat.label}</div>
                <p className="text-zinc-500 font-medium leading-relaxed text-left">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Split Section */}
      <section id="solutions" className="py-40 px-6 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24 items-center">
          <div className="flex-1 relative order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] bg-zinc-200">
              <img 
                src="https://images.pexels.com/photos/7018659/pexels-photo-7018659.jpeg" 
                alt="Expert Logistique" 
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="absolute -bottom-12 -right-12 bg-ivory-emerald text-white p-12 rounded-[2.5rem] shadow-2xl max-w-sm hidden lg:block"
            >
              <Lock className="size-10 mb-6 text-ivory-gold opacity-80" />
              <p className="text-lg font-bold uppercase tracking-tight leading-[1.3] text-left">
                "DjassaOS a redéfini notre vision de la logistique en Côte d'Ivoire. C'est l'outil qui nous manquait."
              </p>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-4">
                 <div className="size-1 bg-ivory-gold rounded-full" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 text-left">CEO, Transport CI</span>
              </div>
            </motion.div>
          </div>
          <div className="flex-1 text-left order-1 lg:order-2">
            <h3 className="text-5xl md:text-6xl font-plus-jakarta font-extrabold uppercase tracking-[-0.03em] text-zinc-950 mb-12 leading-[0.95] text-left">
              UNE VISION LOCALE. <br /><span className="text-ivory-emerald text-left">UN STANDARD MONDIAL.</span>
            </h3>
            <div className="space-y-10">
               {[
                { title: "Pensé pour le Terrain", desc: "Conçu avec les acteurs majeurs du transport à Abidjan pour répondre aux réalités d'Afrique de l'Ouest." },
                { title: "Sécurité & Souveraineté", desc: "Vos données sont protégées selon les plus hauts standards de chiffrement internationaux." },
                { title: "Excellence Continue", desc: "Des mises à jour hebdomadaires basées sur vos retours pour une interface toujours plus fluide." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-8 items-start group text-left">
                   <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200/50 mt-1 group-hover:bg-ivory-emerald group-hover:text-white transition-all duration-300 text-left">
                      <CheckCircle2 className="size-6 text-ivory-emerald group-hover:text-white transition-colors" />
                   </div>
                   <div className="text-left">
                     <h4 className="text-xl font-plus-jakarta font-extrabold uppercase tracking-tight text-zinc-950 mb-2 text-left">{item.title}</h4>
                     <p className="text-zinc-500 text-lg font-medium leading-relaxed text-left">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-56 bg-white text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-50/50 blur-[180px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-5xl mx-auto px-6"
        >
          <h2 className="text-6xl md:text-[9rem] font-plus-jakarta font-black uppercase leading-[0.8] mb-14 tracking-[-0.05em] text-zinc-950 text-center">
            PRÊT À DOMINER <br /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-ivory-emerald to-emerald-800 text-center">LE MARCHÉ ?</span>
          </h2>
          <p className="text-zinc-500 text-xl md:text-2xl mb-16 max-w-2xl mx-auto font-medium tracking-tight text-center">
            Rejoignez les leaders du transport et passez à la vitesse supérieure dès aujourd'hui. L'inscription prend moins de 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8 text-center">
            <Button 
              onClick={() => navigate("/register")}
              className="bg-zinc-950 hover:bg-ivory-orange text-white px-16 h-20 text-xs font-bold uppercase tracking-[0.25em] rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] transition-all active:scale-95 border-none"
            >
              Créer mon espace
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/login")}
              className="border border-zinc-200 bg-white/50 backdrop-blur-md rounded-full h-20 px-16 text-xs font-bold uppercase tracking-[0.25em] hover:bg-white hover:border-zinc-300 transition-all shadow-sm"
            >
              Parler à un expert
              <ChevronRight className="ml-2 size-5" />
            </Button>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="py-32 px-6 md:px-12 border-t border-zinc-100 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-20 mb-32">
            <div className="col-span-1 md:col-span-3 text-left">
               <div className="flex items-center gap-4 mb-10 cursor-pointer" onClick={() => navigate("/") }>
                <div className="bg-ivory-emerald p-2.5 rounded-[1.2rem] shadow-lg shadow-emerald-900/10">
                  <BrandLogo variant="mark" size={30} className="text-white filter brightness-0 invert" />
                </div>
                <span className="text-3xl font-plus-jakarta font-extrabold uppercase tracking-tighter text-zinc-950">Djassa<span className="text-ivory-orange">OS</span></span>
              </div>
              <p className="text-zinc-500 text-lg font-medium max-w-sm leading-relaxed mb-12 text-left">
                Le système d'exploitation de nouvelle génération conçu pour propulser les professionnels du transport routier en Côte d'Ivoire.
              </p>
              <div className="flex gap-8">
                <div className="size-12 bg-white rounded-2xl shadow-sm border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-ivory-emerald hover:border-ivory-emerald transition-all cursor-pointer">
                  <Globe className="size-6" />
                </div>
                <div className="size-12 bg-white rounded-2xl shadow-sm border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-ivory-emerald hover:border-ivory-emerald transition-all cursor-pointer">
                  <Smartphone className="size-6" />
                </div>
              </div>
            </div>
            
            <div className="text-left">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-950 mb-10 text-left">Plateforme</h5>
              <ul className="space-y-6 text-sm font-bold text-zinc-400 uppercase tracking-widest text-left">
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Flotte</li>
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Missions</li>
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Chauffeurs</li>
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Finances</li>
              </ul>
            </div>

            <div className="text-left">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-950 mb-10 text-left">Solutions</h5>
              <ul className="space-y-6 text-sm font-bold text-zinc-400 uppercase tracking-widest text-left">
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Transit</li>
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Distribution</li>
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Carburant</li>
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Conformité</li>
              </ul>
            </div>

            <div className="text-left">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-950 mb-10 text-left">Support</h5>
              <ul className="space-y-6 text-sm font-bold text-zinc-400 uppercase tracking-widest text-left">
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Aide</li>
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Contact</li>
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Statut</li>
                <li className="hover:text-ivory-emerald transition-colors cursor-pointer text-left">Légal</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-zinc-200/60 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              © 2026 DJASSA INFRASTRUCTURE. DÉVELOPPÉ À ABIDJAN.
            </div>
            <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              <span className="hover:text-zinc-950 cursor-pointer transition-colors">Politique de Confidentialité</span>
              <span className="hover:text-zinc-900 cursor-pointer transition-colors">Conditions d'Utilisation</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
