import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { 
  AlertTriangle, 
  Fuel, 
  MapPin, 
  Route, 
  TrendingUp, 
  Truck,
  ArrowRight,
  ChevronRight,
  Wallet,
  Plus,
  ShieldCheck
} from "lucide-react"
import { 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip as ReChartsTooltip, 
  XAxis, 
  YAxis,
  Area,
  AreaChart
} from "recharts"
import { motion } from "motion/react"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { MissionStatusBadge } from "@/components/shared/status-badge"
import { StaggerItem, StaggerList } from "@/components/shared/animated-page"
import { TransportMap } from "@/components/map/transport-map"
import { trackingToMapVehicle } from "@/components/map/map-vehicle"
import { useAlerts, useDashboardStats, useMissions, useTracking } from "@/hooks/use-data"
import { cn } from "@/lib/utils"

const DATE_FULL = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date())

export function DashboardPage() {
  const navigate = useNavigate()
  const stats = useDashboardStats()
  const { data: missions } = useMissions()
  const { data: alerts } = useAlerts()
  const { data: tracking } = useTracking()

  const priorityMissions = (missions ?? [])
    .filter((m) => m.statut === "en_retard" || m.statut === "en_cours")
    .slice(0, 5)

  const recentMissions = priorityMissions.length > 0 ? priorityMissions : (missions ?? []).slice(0, 5)

  const mapVehicles = useMemo(() => {
    const missionById = new Map((missions ?? []).map((m) => [m.id, m]))
    return (tracking ?? [])
      .filter((t) => t.missionId)
      .map((t) => trackingToMapVehicle(t, missionById.get(t.missionId!)))
  }, [tracking, missions])

  return (
    <div className="space-y-10 pb-16">
      {/* Header with Elite feel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20">
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-inter font-black uppercase tracking-tighter leading-none"
          >
            Djassa<span className="text-ivory-orange">OS</span> <span className="text-muted-foreground/30 ml-2 font-normal">03</span>
          </motion.h1>
          <div className="flex items-center gap-3">
             <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
             <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.3em]">
               Supervision Live — {DATE_FULL}
             </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate("/analytics")}
            className="border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl h-14 px-8 font-black uppercase tracking-widest transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Rapports
          </Button>
          <Button 
            variant="orange"
            onClick={() => navigate("/missions?create=1")}
            className="bg-ivory-orange hover:bg-ivory-orange/90 text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest shadow-[0_12px_24px_rgba(226,88,34,0.3)] transition-all active:scale-95 active:translate-y-1"
          >
            <Plus className="mr-2 size-6" strokeWidth={4} />
            Lancer Mission
          </Button>
        </div>
      </div>

      {/* KPI Grid - Premium Cards */}
      <StaggerList className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <StatCard 
            title="Véhicules Actifs" 
            value={String(stats.vehiculesDisponibles)} 
            icon={Truck}
            className="border-none shadow-xl shadow-black/5 bg-white dark:bg-zinc-900 rounded-3xl"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="Missions en Transit"
            value={String(stats.missionsEnCours)}
            icon={Route}
            trend={{ value: `${stats.missionsEnRetard} alertes`, positive: stats.missionsEnRetard === 0 }}
            className="border-none shadow-xl shadow-black/5 bg-white dark:bg-zinc-900 rounded-3xl"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="Chiffre d'Affaires"
            value={formatCurrency(stats.revenusMois)}
            icon={TrendingUp}
            description="Revenu mensuel total"
            className="border-none shadow-xl shadow-emerald-900/10 bg-ivory-emerald text-white rounded-3xl"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="Dépenses"
            value={formatCurrency(stats.depensesMois)}
            icon={Wallet}
            trend={{ value: "Opérationnel", positive: true }}
            className="border-none shadow-xl shadow-orange-900/10 bg-ivory-orange text-white rounded-3xl"
          />
        </StaggerItem>
      </StaggerList>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Real-time Fleet Tracking */}
        <Card className="lg:col-span-8 border-none shadow-2xl shadow-black/5 bg-white dark:bg-zinc-900 overflow-hidden rounded-[2.5rem] relative">
          <CardHeader className="flex flex-row items-center justify-between px-8 py-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-20 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <CardTitle className="text-2xl font-inter font-black uppercase tracking-tight">Espace Opérationnel Live</CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mt-1">Géo-localisation temps réel Côte d'Ivoire</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800">
                  <span className="size-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Sync Active</span>
               </div>
               <Button variant="ghost" size="icon" onClick={() => navigate("/tracking")} className="rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800"><MapPin className="size-5" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 z-10 min-h-[500px]">
            <TransportMap
              height={550}
              zoom={7}
              missions={(missions ?? []).filter((m) => m.statut !== "livree" && m.statut !== "annulee")}
              vehicles={mapVehicles}
              showLegend={false}
              showControls={true}
              showDetailPanel={false}
              showCities={true}
              onMissionSelect={(id) => id && navigate(`/tracking?mission=${id}`)}
            />
            
            {/* Map Interaction Overlays */}
            <div className="absolute bottom-8 left-8 flex flex-col gap-3 pointer-events-none">
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-zinc-900 text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-6 pointer-events-auto border border-white/5"
               >
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <Truck className="size-6 text-ivory-orange" />
                  </div>
                  <div>
                    <div className="text-3xl font-black leading-none">{stats.vehiculesDisponibles}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">Véhicules Libres</div>
                  </div>
               </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Operational Intelligence / Alerts */}
        <Card className="lg:col-span-4 border-none shadow-2xl shadow-black/5 bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-2xl font-inter font-black uppercase tracking-tight flex items-center gap-3">
              Flux Intel
              <Badge className="bg-ivory-orange text-white text-[10px] font-black border-none px-2 rounded-lg">{stats.alertes}</Badge>
            </CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mt-1">Incidents & Notifications</CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-6 space-y-4 max-h-[550px] overflow-auto scrollbar-none">
            {alerts?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 opacity-40">
                 <div className="bg-zinc-100 dark:bg-zinc-800 p-8 rounded-full shadow-inner"><ShieldCheck className="size-12" /></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em]">Système Nominal</p>
              </div>
            )}
            {alerts?.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-start gap-5 p-5 rounded-[1.75rem] bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-ivory-orange/20 transition-all cursor-pointer group"
                onClick={() => navigate(alert.href ?? "/dashboard")}
              >
                <div className={cn(
                  "mt-1.5 size-2.5 shrink-0 rounded-full shadow-lg",
                  alert.severity === "danger" ? "bg-red-500 shadow-red-500/40" : 
                  alert.severity === "warning" ? "bg-ivory-gold shadow-ivory-gold/40" : "bg-blue-500 shadow-blue-500/40"
                )} />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{alert.type}</span>
                    <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">Maintenant</span>
                  </div>
                  <p className="text-sm font-black text-foreground leading-[1.3] group-hover:text-ivory-orange transition-colors">{alert.message}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
          <div className="px-8 py-6 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 text-center">
             <Button variant="link" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-ivory-emerald underline-offset-8">Historique Complet</Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
         {/* Financial Performance Analytics */}
         <Card className="lg:col-span-7 border-none shadow-2xl shadow-black/5 bg-white dark:bg-zinc-900 rounded-[2.5rem]">
            <CardHeader className="px-8 py-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-inter font-black uppercase tracking-tight">Croissance & Revenus</CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mt-1">Analyse des flux financiers mensuels</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <div className="size-2 bg-ivory-emerald rounded-full" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Entrées</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="size-2 bg-ivory-orange rounded-full" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Sorties</span>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-8">
              <ResponsiveContainer width="100%" height={380}>
                <AreaChart data={stats.revenueChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00563B" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#00563B" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E25822" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#E25822" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} strokeOpacity={0.4} className="stroke-zinc-200 dark:stroke-zinc-800" />
                  <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#888'}} dy={15} className="font-black uppercase tracking-[0.2em]" />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#888'}} dx={-15} unit="M" />
                  <ReChartsTooltip
                    cursor={{ stroke: '#00563B', strokeWidth: 2, strokeDasharray: '4 4' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-zinc-900 text-white px-6 py-5 rounded-[2rem] shadow-2xl border border-white/10 space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ivory-gold">{payload[0].payload.mois}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between gap-12 items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Revenus</span>
                                <span className="text-lg font-black">{payload[0].value} M XOF</span>
                              </div>
                              <div className="flex justify-between gap-12 items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Dépenses</span>
                                <span className="text-lg font-black text-ivory-orange">{payload[1].value} M XOF</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area type="monotone" dataKey="revenus" stroke="#00563B" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="depenses" stroke="#E25822" strokeWidth={4} fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Latest Operations Table */}
         <Card className="lg:col-span-5 border-none shadow-2xl shadow-black/5 bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="px-8 py-8 flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-transparent">
              <div>
                <CardTitle className="text-2xl font-inter font-black uppercase tracking-tight">Missions Actives</CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mt-1">Supervision des transits</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/missions")} 
                className="text-[9px] font-black uppercase tracking-[0.3em] bg-white dark:bg-zinc-800 rounded-xl px-4 h-9 shadow-sm"
              >
                Explorer
              </Button>
            </CardHeader>
            <CardContent className="px-6 py-6 space-y-4">
               {recentMissions.map((m, idx) => (
                 <motion.div
                   key={m.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: idx * 0.05 }}
                   whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.02)" }}
                   className="group flex items-center justify-between p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 hover:border-ivory-emerald/30 transition-all cursor-pointer"
                   onClick={() => navigate(`/tracking?mission=${m.id}`)}
                 >
                    <div className="flex items-center gap-5">
                       <div className="bg-ivory-emerald text-white p-3 rounded-2xl group-hover:bg-ivory-orange transition-all duration-300 shadow-lg shadow-emerald-900/10 group-hover:shadow-orange-900/10">
                          <Truck className="size-6 transition-transform group-hover:-rotate-6" />
                       </div>
                       <div>
                          <p className="text-base font-black uppercase tracking-tight">{m.id} <span className="text-muted-foreground/40 font-bold ml-1">· {m.client}</span></p>
                          <div className="flex items-center gap-2.5 mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                             <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{m.depart}</span>
                             <div className="h-[2px] w-4 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                             <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{m.destination}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                       <MissionStatusBadge status={m.statut} className="h-7 px-4 rounded-full text-[9px] font-black uppercase tracking-widest border-none" />
                       <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.3em] text-ivory-orange translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Suivi Live <ChevronRight className="size-2.5" />
                       </div>
                    </div>
                 </motion.div>
               ))}
            </CardContent>
            <div className="px-8 py-8 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="size-2 bg-ivory-emerald rounded-full" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{missions?.length || 0} Missions au total</span>
               </div>
               <Button onClick={() => navigate("/missions")} className="rounded-xl px-6 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-[0.3em] h-9">Gérer tout</Button>
            </div>
         </Card>
      </div>
    </div>
  )
}
