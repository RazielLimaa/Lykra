"use client"

interface AudioVisualizerProps {
  audioLevel: number
  isRecording: boolean
}

export function AudioVisualizer({ audioLevel, isRecording }: AudioVisualizerProps) {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="bg-cyan-400 rounded-full transition-all duration-150"
          style={{
            width: "3px",
            height: isRecording ? `${8 + Math.random() * audioLevel * 40}px` : "8px",
            opacity: isRecording ? 0.5 + audioLevel : 0.3,
          }}
        />
      ))}
    </div>
  )
}
