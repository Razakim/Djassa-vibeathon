import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/shared/brand-logo"

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-white text-zinc-950 font-brutal-mono min-h-screen selection:bg-zinc-950 selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 border-zinc-950 bg-white/95 backdrop-blur-md px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <BrandLogo variant="full" size={40} />
          <span className="text-3xl font-brutal-head tracking-tighter uppercase">Djassa</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-12 text-sm font-black uppercase tracking-widest">
          <a href="#features" className="hover:line-through transition-all decoration-2">Features</a>
          <a href="#stats" className="hover:line-through transition-all decoration-2">ROI</a>
          <a href="#ecosystem" className="hover:line-through transition-all decoration-2">Ecosystem</a>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/login")}
            className="hidden sm:block text-sm font-black uppercase tracking-widest hover:underline"
          >
            Log In
          </button>
          <Button 
            onClick={() => navigate("/register")}
            className="bg-zinc-950 text-white rounded-none px-8 py-6 text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row min-h-screen border-b-2 border-zinc-950 pt-20">
        <div className="lg:w-[55%] p-8 md:p-20 flex flex-col justify-center border-r-0 lg:border-r-2 border-zinc-950 bg-white relative">
          <div className="absolute top-10 left-10 opacity-5 pointer-events-none text-[20rem] font-brutal-head leading-none select-none">
            DJ
          </div>
          <div className="relative z-10">
            <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-brutal-head uppercase leading-[0.85] mb-10 tracking-tighter">
              THE <br /> OPERATING <br /> SYSTEM
            </h1>
            <div className="flex flex-col md:flex-row items-baseline gap-6 mb-12">
               <span className="text-3xl lg:text-5xl font-brutal-head uppercase bg-zinc-950 text-white px-4 py-2">FOR WEST AFRICAN</span>
               <span className="text-3xl lg:text-5xl font-brutal-head uppercase border-2 border-zinc-950 px-4 py-2 italic">LOGISTICS</span>
            </div>
            <p className="text-xl md:text-2xl max-w-xl mb-14 font-bold leading-tight uppercase tracking-tight text-zinc-600">
              Centralize fleet, drivers, and missions into one robust infrastructure. End the WhatsApp & Excel chaos.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                onClick={() => navigate("/register")}
                className="bg-zinc-950 text-white px-12 h-20 text-2xl font-brutal-head uppercase rounded-none hover:bg-zinc-800 transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                JOIN THE ELITE
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:w-[45%] relative bg-zinc-950 overflow-hidden min-h-[500px] lg:min-h-0">
          <video 
            src="https://videos.pexels.com/video-files/28744906/12461966_640_360_24fps.mp4" 
            poster="https://images.pexels.com/videos/28744906/cargo-cargo-trailers-cargo-transport-commercial-truck-28744906.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200" 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute top-10 right-10 bg-white text-zinc-950 p-6 border-2 border-zinc-950 flex flex-col gap-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-black tracking-widest uppercase">LIVE_STATUS</span>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 animate-pulse" />
              <span className="text-xl font-brutal-head">1,248 ACTIVE TRUCKS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="border-b-2 border-zinc-950 py-10 bg-zinc-950 text-white overflow-hidden whitespace-nowrap relative">
        <div className="flex animate-marquee">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex shrink-0">
              <span className="text-4xl md:text-6xl font-brutal-head uppercase mx-12 flex items-center gap-12">
                FLEET <span className="text-zinc-700">•</span> CHAUFFEURS <span className="text-zinc-700">•</span> MISSIONS <span className="text-zinc-700">•</span> ACCOUNTING <span className="text-zinc-700">•</span> LOGISTICS <span className="text-zinc-700">•</span> EFFICIENCY
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Sections */}
      <section id="features" className="flex flex-col">
        {/* 01 - Fleet */}
        <div className="border-b-2 border-zinc-950 group cursor-default hover:bg-zinc-50 transition-all">
          <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center p-8 md:p-24 gap-16 md:gap-32">
            <div className="text-[10rem] md:text-[20rem] font-brutal-head text-zinc-100 group-hover:text-zinc-950 transition-colors duration-700 leading-none select-none">01</div>
            <div className="flex-1">
              <div className="text-xs font-black tracking-[0.4em] uppercase mb-4 text-zinc-400">OPERATIONAL_EXCELLENCE</div>
              <h3 className="text-5xl md:text-8xl font-brutal-head uppercase mb-8 tracking-tighter leading-none">Fleet <br /> Management</h3>
              <p className="text-xl md:text-2xl max-w-xl font-bold uppercase tracking-tight text-zinc-700 leading-tight">
                Real-time tracking, fuel monitoring, and predictive maintenance for your entire West African fleet.
              </p>
            </div>
            <div className="w-full lg:w-1/3 aspect-video relative border-4 border-zinc-950 overflow-hidden bg-zinc-200 group-hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all duration-500">
               <img 
                 src="https://images.pexels.com/photos/20097991/pexels-photo-20097991.jpeg?auto=compress&cs=tinysrgb&w=800&q=80" 
                 alt="Truck" 
                 className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
               />
            </div>
          </div>
        </div>

        {/* 02 - Drivers */}
        <div className="border-b-2 border-zinc-950 group cursor-default hover:bg-zinc-50 transition-all">
          <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row-reverse items-center p-8 md:p-24 gap-16 md:gap-32">
            <div className="text-[10rem] md:text-[20rem] font-brutal-head text-zinc-100 group-hover:text-zinc-950 transition-colors duration-700 leading-none select-none">02</div>
            <div className="flex-1">
              <div className="text-xs font-black tracking-[0.4em] uppercase mb-4 text-zinc-400">HUMAN_CAPITAL</div>
              <h3 className="text-5xl md:text-8xl font-brutal-head uppercase mb-8 tracking-tighter leading-none text-right lg:text-left">Driver <br /> Performance</h3>
              <p className="text-xl md:text-2xl max-w-xl font-bold uppercase tracking-tight text-zinc-700 leading-tight lg:text-left">
                Monitor punctuality, safety scores, and mission success rates. Digitized HR for your mobile workforce.
              </p>
            </div>
            <div className="w-full lg:w-1/3 aspect-video border-4 border-zinc-950 p-10 flex flex-col justify-between bg-zinc-950 text-white group-hover:shadow-[-20px_20px_0px_0px_rgba(0,0,0,1)] transition-all duration-500">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-widest opacity-50">DRIVER_ID: 942</span>
                <span className="px-4 py-1.5 bg-green-500 text-zinc-950 text-xs font-black uppercase tracking-tighter">ACTIVE_MISSION</span>
              </div>
              <div>
                <div className="text-4xl font-brutal-head tracking-tighter leading-none mb-6">KWAME MENSAH</div>
                <div className="w-full bg-zinc-800 h-4 border border-zinc-700">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "92%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: 0.5, ease: "circOut" }}
                    className="bg-white h-full" 
                  />
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-black tracking-widest opacity-50 uppercase">
                  <span>Safety Score</span>
                  <span>92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 03 - Missions */}
        <div className="border-b-2 border-zinc-950 group cursor-default hover:bg-zinc-50 transition-all">
          <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center p-8 md:p-24 gap-16 md:gap-32">
            <div className="text-[10rem] md:text-[20rem] font-brutal-head text-zinc-100 group-hover:text-zinc-950 transition-colors duration-700 leading-none select-none">03</div>
            <div className="flex-1">
              <div className="text-xs font-black tracking-[0.4em] uppercase mb-4 text-zinc-400">MISSION_CRITICAL</div>
              <h3 className="text-5xl md:text-8xl font-brutal-head uppercase mb-8 tracking-tighter leading-none">Mission <br /> Control</h3>
              <p className="text-xl md:text-2xl max-w-xl font-bold uppercase tracking-tight text-zinc-700 leading-tight">
                From creation to proof-of-delivery. Fully digitized workflows that eliminate paperwork and errors.
              </p>
            </div>
            <div className="w-full lg:w-1/3 border-4 border-zinc-950 p-12 bg-white group-hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all duration-500">
              <div className="flex items-center gap-4 mb-10">
                <ShieldCheck className="w-12 h-12 text-zinc-950" />
                <span className="font-brutal-head text-2xl uppercase tracking-tighter">VERIFIED DELIVERY</span>
              </div>
              <div className="space-y-6 text-lg border-t-4 border-zinc-950 pt-10 font-black uppercase tracking-widest">
                <div className="flex justify-between border-b border-zinc-200 pb-4">
                  <span className="text-zinc-400">Origin</span>
                  <span className="font-brutal-head text-zinc-950">ABIDJAN</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-4">
                  <span className="text-zinc-400">Dest</span>
                  <span className="font-brutal-head text-zinc-950">BAMAKO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status</span>
                  <span className="text-green-600 font-brutal-head">COMPLETED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Metrics */}
      <section id="stats" className="py-40 border-b-2 border-zinc-950 bg-zinc-50 relative overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-8 md:px-20 text-center relative z-10">
          <h2 className="text-6xl md:text-9xl font-brutal-head uppercase mb-32 tracking-tighter leading-none">
            ABSOLUTE CONTROL <br /> HIGHER MARGINS
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {[
              { icon: TrendingUp, val: "+32%", label: "Operational Margin", desc: "Average increase in net profitability within 6 months of adoption." },
              { icon: null, val: "0", label: "Lost Documents", desc: "Total digital centralization of proof of delivery and waybills.", dark: true },
              { icon: null, val: "100%", label: "Compliance Rate", desc: "Real-time automated alerts for license, insurance, and maintenance." }
            ].map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className={`aspect-square border-4 border-zinc-950 p-12 flex flex-col justify-between transition-all hover:-translate-y-4 hover:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] cursor-default ${m.dark ? 'bg-zinc-950 text-white hover:bg-zinc-900' : 'bg-white text-zinc-950'}`}
              >
                {m.icon ? <m.icon className="w-20 h-20" /> : <div className="h-20" />}
                <div className="text-left">
                  <div className="text-8xl font-brutal-head mb-4 tracking-tighter leading-none">{m.val}</div>
                  <div className="text-2xl font-brutal-head uppercase mb-6 leading-none tracking-tight">{m.label}</div>
                  <p className={`text-base font-bold uppercase tracking-tight leading-tight ${m.dark ? 'opacity-50' : 'text-zinc-500'}`}>{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <img src="https://cdn.jsdelivr.net/npm/game-icons-transparent@latest/svgs/lorc/waves.svg" className="w-full h-full object-cover scale-150" alt="" />
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "circOut" }}
          className="relative z-10 w-full max-w-7xl"
        >
          <h2 className="text-7xl md:text-[15rem] lg:text-[18rem] font-brutal-head uppercase leading-[0.75] mb-24 tracking-tighter">
            TRANSFORM <br /> NOW
          </h2>
          
          <div className="flex flex-col md:flex-row border-4 border-white p-4 gap-4 bg-white/5 backdrop-blur-xl max-w-5xl mx-auto">
            <input 
              type="email" 
              placeholder="ENTER CORPORATE EMAIL" 
              className="flex-1 bg-transparent text-white px-10 py-8 text-3xl font-brutal-mono focus:outline-none placeholder:text-white/10 uppercase font-black" 
            />
            <Button 
              className="bg-white text-zinc-950 h-auto py-8 px-20 text-4xl font-brutal-head uppercase rounded-none hover:bg-zinc-200 transition-all active:scale-95 active:translate-y-2"
            >
              SUBMIT
            </Button>
          </div>
          
          <div className="mt-24 opacity-30 font-brutal-head uppercase tracking-[0.5em] text-sm md:text-2xl">
            INFRASTRUCTURE FOR WEST AFRICAN LOGISTICS
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="p-12 md:p-24 border-t-4 border-zinc-950 flex flex-col md:flex-row justify-between items-center gap-16 bg-white">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo variant="full" size={56} />
            <div className="text-6xl font-brutal-head tracking-tighter uppercase leading-none">Djassa</div>
          </div>
          <div className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Operating System for Transport</div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 uppercase font-black text-sm md:text-lg tracking-widest">
          <div className="flex flex-col gap-6">
            <h4 className="text-zinc-300 text-[10px] tracking-[0.5em]">PLATFORM</h4>
            <a href="#" className="hover:line-through transition-all decoration-4">Fleet</a>
            <a href="#" className="hover:line-through transition-all decoration-4">Drivers</a>
            <a href="#" className="hover:line-through transition-all decoration-4">Missions</a>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="text-zinc-300 text-[10px] tracking-[0.5em]">COMPANY</h4>
            <a href="#" className="hover:line-through transition-all decoration-4">About</a>
            <a href="#" className="hover:line-through transition-all decoration-4">Careers</a>
            <a href="#" className="hover:line-through transition-all decoration-4">Contact</a>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex gap-4">
            <a href="#" className="w-12 h-12 border-2 border-zinc-950 flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all cursor-pointer">
              <ChevronRight className="w-6 h-6" />
            </a>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
            © 2026 DJASSA INFRASTRUCTURE. ALL RIGHTS RESERVED.
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
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  )
}
