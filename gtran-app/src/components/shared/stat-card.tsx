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
  return (
    <motion.div
      className="h-full w-full min-w-0"
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgb(0 0 0 / 0.06)" }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("h-full gap-3 py-4 transition-colors hover:border-primary/20", className)}>
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-0">
          <CardTitle className="min-w-0 text-sm font-medium leading-snug text-muted-foreground">{title}</CardTitle>
          <motion.div className="shrink-0" whileHover={{ rotate: 8, scale: 1.1 }} transition={{ duration: 0.2 }}>
            <Icon className="size-4 text-muted-foreground" />
          </motion.div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg font-bold leading-tight tracking-tight break-words sm:text-xl lg:text-2xl">{value}</div>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          {trend && (
            <p className={cn("mt-1 text-xs", trend.positive ? "text-emerald-600" : "text-amber-600")}>
              {trend.value}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
