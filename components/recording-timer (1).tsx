"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface RecordingTimerProps {
  isRecording: boolean
  chunkDuration: number
}

export function RecordingTimer({ isRecording, chunkDuration }: RecordingTimerProps) {
  const [timeLeft, setTimeLeft] = useState(chunkDuration)

  useEffect(() => {
    if (isRecording) {
      setTimeLeft(chunkDuration)
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isRecording, chunkDuration])

  if (!isRecording) return null

  return (
    <div className="flex items-center space-x-2">
      <Clock className="w-4 h-4 text-red-400" />
      <span className="text-red-400 text-sm font-mono">{timeLeft}s restantes</span>
    </div>
  )
}
