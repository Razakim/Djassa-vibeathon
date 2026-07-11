import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg"
import { colors } from "../tokens"

interface BrandMarkProps {
  size?: number
  variant?: "emerald" | "metal" | "white"
}

export function BrandMark({ size = 40, variant = "emerald" }: BrandMarkProps) {
  const fill = variant === "emerald" ? colors.primary : variant === "white" ? "#FFFFFF" : "#242424"

  if (variant === "metal") {
    return (
      <Svg width={size} height={size} viewBox="180 160 330 360">
        <Defs>
          <LinearGradient id="d-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ffffff" />
            <Stop offset="40%" stopColor="#efefef" />
            <Stop offset="72%" stopColor="#9a9a9a" />
            <Stop offset="100%" stopColor="#5f5f5f" />
          </LinearGradient>
        </Defs>
        <Path
          d="M200,170 L300,170 C400,170 490,230 490,340 C490,450 400,510 300,510 L240,510 L200,470 Z M300,225 C380,225 440,270 440,340 C440,410 380,455 300,455 Z"
          fill="#242424"
          fillRule="evenodd"
          transform="translate(12,12)"
        />
        <Path
          d="M200,170 L300,170 C400,170 490,230 490,340 C490,450 400,510 300,510 L240,510 L200,470 Z M300,225 C380,225 440,270 440,340 C440,410 380,455 300,455 Z"
          fill="url(#d-metal)"
          fillRule="evenodd"
        />
      </Svg>
    )
  }

  return (
    <Svg width={size} height={size} viewBox="180 160 330 360">
      <Path
        d="M200,170 L300,170 C400,170 490,230 490,340 C490,450 400,510 300,510 L240,510 L200,470 Z M300,225 C380,225 440,270 440,340 C440,410 380,455 300,455 Z"
        fill={fill}
        fillRule="evenodd"
      />
    </Svg>
  )
}
