"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, Settings } from "lucide-react"

interface TTSSettingsProps {
  onVoiceChange: (voice: string) => void
  onRateChange: (rate: number) => void
  currentVoice: string
  currentRate: number
}

export function TTSSettings({ onVoiceChange, onRateChange, currentVoice, currentRate }: TTSSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const voices = [
    { name: "pt-BR-Chirp3-HD-Adhara", label: "Adhara (Feminina)" },
  ]

  const rates = [
    { value: 0.8, label: "Lenta" },
    { value: 1.0, label: "Normal" },
    { value: 1.3, label: "Rápida" },
    { value: 1.6, label: "Muito Rápida" },
  ]

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="bg-transparent border-white/20 text-white hover:bg-white/10"
      >
        <Settings className="w-4 h-4 mr-2" />
        Configurar Voz
      </Button>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400 text-sm">Configurações de Voz</span>
        </div>
        <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm" className="text-white/60 hover:text-white">
          ✕
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-white/80 text-xs uppercase tracking-wider mb-2 block">Voz</label>
          <div className="grid grid-cols-1 gap-2">
            {voices.map((voice) => (
              <Button
                key={voice.name}
                onClick={() => onVoiceChange(voice.name)}
                variant={currentVoice === voice.name ? "default" : "outline"}
                size="sm"
                className={
                  currentVoice === voice.name
                    ? "bg-cyan-500 text-black hover:bg-cyan-400"
                    : "bg-transparent border-white/20 text-white hover:bg-white/10"
                }
              >
                {voice.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-white/80 text-xs uppercase tracking-wider mb-2 block">Velocidade</label>
          <div className="flex space-x-2">
            {rates.map((rate) => (
              <Button
                key={rate.value}
                onClick={() => onRateChange(rate.value)}
                variant={currentRate === rate.value ? "default" : "outline"}
                size="sm"
                className={
                  currentRate === rate.value
                    ? "bg-cyan-500 text-black hover:bg-cyan-400"
                    : "bg-transparent border-white/20 text-white hover:bg-white/10"
                }
              >
                {rate.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
