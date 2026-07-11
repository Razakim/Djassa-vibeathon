import type { ReactNode } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  action?: { label: string; onClick?: () => void; disabled?: boolean }
  children?: ReactNode
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-inter font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-none">
          {title}
        </h1>
        {description && (
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {children}
        {action && (
          <Button
            onClick={action.onClick}
            disabled={action.disabled}
            className="bg-ivory-orange hover:bg-ivory-orange/90 text-white rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[11px] shadow-md shadow-orange-500/20 transition-all active:scale-95"
          >
            <Plus className="mr-2 size-4" strokeWidth={3} />
            {action.label}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
