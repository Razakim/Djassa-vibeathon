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
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgb(0 0 0 / 0.06)" }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("transition-colors hover:border-primary/20", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <motion.div whileHover={{ rotate: 8, scale: 1.1 }} transition={{ duration: 0.2 }}>
            <Icon className="size-4 text-muted-foreground" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && <p className="text-muted-foreground text-xs mt-1">{description}</p>}
          {trend && (
            <p className={cn("text-xs mt-1", trend.positive ? "text-emerald-600" : "text-amber-600")}>
              {trend.value}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
