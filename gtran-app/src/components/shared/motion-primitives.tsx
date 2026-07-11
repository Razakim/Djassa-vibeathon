import { motion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function MotionCard({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgb(0 0 0 / 0.08)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className={cn("rounded-xl", className)}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
