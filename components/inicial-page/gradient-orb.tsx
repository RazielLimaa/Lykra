"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type GradientOrbProps = {
  variant?: "orange" | "blue" | "purple"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  followMouse?: boolean
  intensity?: number
}

export function GradientOrb({
  variant = "orange",
  size = "lg",
  className,
  followMouse = false,
  intensity = 0.1,
}: GradientOrbProps) {
  const orbRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Size mapping
  const sizeMap = {
    sm: "w-32 h-32 md:w-48 md:h-48",
    md: "w-48 h-48 md:w-64 md:h-64",
    lg: "w-64 h-64 md:w-96 md:h-96",
    xl: "w-96 h-96 md:w-[32rem] md:h-[32rem]",
  }

  // Color mapping
  const colorMap = {
    orange: "from-orange-400/50 to-amber-500/50",
    blue: "from-blue-400/50 to-cyan-500/50",
    purple: "from-purple-400/50 to-pink-500/50",
  }

  useEffect(() => {
    if (!followMouse) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!orbRef.current) return

      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Calculate position as percentage of window
      const x = (clientX / innerWidth - 0.5) * intensity * 100
      const y = (clientY / innerHeight - 0.5) * intensity * 100

      setPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [followMouse, intensity])

  return (
    <div
      ref={orbRef}
      className={cn(
        "absolute rounded-full blur-3xl opacity-60 bg-gradient-to-br pointer-events-none",
        sizeMap[size],
        colorMap[variant],
        className,
      )}
      style={{
        transform: followMouse ? `translate(${position.x}px, ${position.y}px)` : undefined,
        transition: followMouse ? "transform 0.2s ease-out" : undefined,
      }}
    />
  )
}
