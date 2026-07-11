import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-ivory-orange selection:text-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 flex h-14 w-full min-w-0 rounded-2xl border bg-white px-6 py-2 text-base font-bold transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-sm",
        "focus:border-ivory-emerald focus:ring-4 focus:ring-ivory-emerald/5 focus:shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export { Input }
