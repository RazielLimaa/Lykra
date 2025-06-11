"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, Play, Pause } from "lucide-react"

interface Voice {
  id: string
  name: string
  language: string
  gender: string
  provider: string
  style?: string
}

// Lista de vozes disponíveis (agora usando ElevenLabs)
const AVAILABLE_VOICES: Voice[] = [
  { id: "pt-BR-francisca", name: "Rachel", language: "pt-BR", gender: "female", provider: "ElevenLabs" },
  { id: "pt-BR-isadora", name: "Bella", language: "pt-BR", gender: "female", provider: "ElevenLabs" },
  { id: "pt-BR-camila", name: "Elli", language: "pt-BR", gender: "female", provider: "ElevenLabs" },
  { id: "pt-BR-eloa", name: "Grace", language: "pt-BR", gender: "female", provider: "ElevenLabs" },
]

interface VoiceSelectorProps {
  selectedVoice: string
  onVoiceChange: (voiceId: string) => void
}

export function VoiceSelector({ selectedVoice, onVoiceChange }: VoiceSelectorProps) {
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

  const testVoice = async (voiceId: string, voiceName: string) => {
    if (isPlaying === voiceId) {
      // Parar áudio atual
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
        setCurrentAudio(null)
      }
      setIsPlaying(null)
      return
    }

    try {
      setIsPlaying(voiceId)

      // Parar qualquer áudio anterior
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }

      const testText = `Olá! Eu sou a ${voiceName}. Esta é a minha voz para conversar com você.`

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: testText,
          voice: voiceId,
          style: "Friendly",
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao gerar áudio de teste")
      }

      const data = await response.json()

      if (!data.audioContent) {
        throw new Error("Nenhum conteúdo de áudio recebido")
      }

      // Verificar se é uma URL ou base64
      let audioUrl: string
      if (data.audioContent.startsWith("http")) {
        audioUrl = data.audioContent
      } else {
        const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0))], {
          type: "audio/mp3",
        })
        audioUrl = URL.createObjectURL(audioBlob)
      }

      const audio = new Audio(audioUrl)
      setCurrentAudio(audio)

      audio.onended = () => {
        setIsPlaying(null)
        if (!data.audioContent.startsWith("http")) {
          URL.revokeObjectURL(audioUrl)
        }
        setCurrentAudio(null)
      }

      audio.onerror = () => {
        setIsPlaying(null)
        if (!data.audioContent.startsWith("http")) {
          URL.revokeObjectURL(audioUrl)
        }
        setCurrentAudio(null)
      }

      await audio.play()
    } catch (error) {
      console.error("Erro ao testar voz:", error)
      setIsPlaying(null)
    }
  }

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
    }
  }, [currentAudio])

  return (
    <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-cyan-400" />
          <span>Seletor de Voz (ElevenLabs)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {AVAILABLE_VOICES.map((voice) => (
          <div
            key={voice.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
              selectedVoice === voice.id
                ? "border-cyan-400 bg-cyan-400/10"
                : "border-white/20 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="text-white font-medium">{voice.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {voice.language} • {voice.provider}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => testVoice(voice.id, voice.name)}
                variant="ghost"
                size="sm"
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
              >
                {isPlaying === voice.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>

              <Button
                onClick={() => onVoiceChange(voice.id)}
                variant={selectedVoice === voice.id ? "default" : "outline"}
                size="sm"
                className={
                  selectedVoice === voice.id
                    ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                {selectedVoice === voice.id ? "Selecionada" : "Selecionar"}
              </Button>
            </div>
          </div>
        ))}

        <div className="bg-blue-800/20 border border-blue-400/20 rounded-lg p-3 mt-4">
          <p className="text-blue-400 text-sm">
            <strong>Nota:</strong> Usando ElevenLabs como alternativa ao Murf.ai. Estas vozes são gratuitas e não
            requerem API key.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
