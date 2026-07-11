import { useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface GooeyInputProps extends React.ComponentProps<"input"> {
  label?: string
}

export function GooeyInput({ label, className, ...props }: GooeyInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="relative">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">{label}</label>
      )}
      <div className="relative">
        <motion.div
          className="pointer-events-none absolute -inset-0.5 rounded-lg bg-gradient-to-r from-violet-500/40 via-blue-500/40 to-cyan-500/40 blur-sm"
          animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.95 }}
          transition={{ duration: 0.2 }}
        />
        <input
          className={cn(
            "relative w-full rounded-lg border border-input bg-background/80 px-3 py-2.5 text-sm shadow-xs outline-none transition-all",
            "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
            className
          )}
          onFocus={(e) => {
            setFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />
      </div>
    </div>
  )
}
