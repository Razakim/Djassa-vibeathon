import type { LucideIcon } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  trend?: { value: string; positive?: boolean }
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  // Detect colored card (bg-ivory-*) to apply inverted icon styling
  const isColored = className?.includes("bg-ivory-")

  return (
    <motion.div
      className="h-full w-full min-w-0"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
    >
      <Card className={cn("h-full gap-0 py-0 overflow-hidden transition-all", className)}>
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 p-6 pb-3">
          <CardTitle
            className={cn(
              "text-[11px] font-black uppercase tracking-[0.2em] leading-snug",
              isColored ? "text-white/60" : "text-muted-foreground"
            )}
          >
            {title}
          </CardTitle>
          <motion.div
            className={cn(
              "shrink-0 p-2.5 rounded-xl",
              isColored ? "bg-white/15" : "bg-zinc-100 dark:bg-zinc-800"
            )}
            whileHover={{ rotate: 8, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              className={cn("size-4", isColored ? "text-white" : "text-muted-foreground")}
              strokeWidth={2.5}
            />
          </motion.div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <div
            className={cn(
              "text-2xl lg:text-3xl font-inter font-black tracking-tight leading-none",
              isColored ? "text-white" : "text-zinc-950 dark:text-white"
            )}
          >
            {value}
          </div>
          {description && (
            <p className={cn("mt-2 text-[10px] font-bold uppercase tracking-widest", isColored ? "text-white/50" : "text-muted-foreground")}>
              {description}
            </p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block",
                isColored
                  ? "bg-white/15 text-white"
                  : trend.positive
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
              )}
            >
              {trend.value}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
