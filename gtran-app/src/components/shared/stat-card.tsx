import type { LucideIcon } from "lucide-react"
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
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-muted-foreground text-xs mt-1">{description}</p>}
        {trend && (
          <p className={cn("text-xs mt-1", trend.positive ? "text-emerald-400" : "text-amber-400")}>
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
