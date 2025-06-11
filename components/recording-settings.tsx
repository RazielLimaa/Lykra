"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecordingSettingsProps {
  chunkDuration: number
  onDurationChange: (duration: number) => void
}

export function RecordingSettings({ chunkDuration, onDurationChange }: RecordingSettingsProps) {
  const durations = [5, 8, 10, 15]

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Settings className="w-4 h-4 text-cyan-400" />
        <span className="text-cyan-400 text-sm">Duração da Gravação</span>
      </div>
      <div className="flex space-x-2">
        {durations.map((duration) => (
          <Button
            key={duration}
            onClick={() => onDurationChange(duration)}
            variant={chunkDuration === duration ? "default" : "outline"}
            size="sm"
            className={
              chunkDuration === duration
                ? "bg-cyan-500 text-black hover:bg-cyan-400"
                : "bg-transparent border-white/20 text-white hover:bg-white/10"
            }
          >
            {duration}s
          </Button>
        ))}
      </div>
    </div>
  )
}
