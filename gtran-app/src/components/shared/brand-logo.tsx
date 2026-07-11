import { cn } from "@/lib/utils"

/** `full` = logo avec fond noir arrondi · `mark` = monogramme D seul (sidebar, fonds colorés) */
export type BrandLogoVariant = "full" | "mark"

interface BrandLogoProps {
  variant?: BrandLogoVariant
  size?: number
  className?: string
}

export function BrandLogo({ variant = "full", size = 36, className }: BrandLogoProps) {
  const src = variant === "full" ? "/icons.svg" : "/logo-mark.svg"

  return (
    <img
      src={src}
      alt="Djassa"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      draggable={false}
    />
  )
}
