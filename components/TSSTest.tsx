"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Volume2, Play, Pause, Loader2 } from "lucide-react"

export function TTSTest() {
  const [testText, setTestText] = useState("Olá! Este é um teste da nova voz do Murf.ai.")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

  const testMurfTTS = async () => {
    if (isPlaying && currentAudio) {
      // Parar áudio atual
      currentAudio.pause()
      currentAudio.currentTime = 0
      setCurrentAudio(null)
      setIsPlaying(false)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log("🧪 Testando Murf.ai TTS...")

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: testText,
          voice: "pt-BR-francisca",
          style: "Friendly",
        }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ Murf.ai TTS: Dados recebidos", data)

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
      setIsPlaying(true)

      audio.onended = () => {
        setIsPlaying(false)
        if (!data.audioContent.startsWith("http")) {
          URL.revokeObjectURL(audioUrl)
        }
        setCurrentAudio(null)
      }

      audio.onerror = (e) => {
        console.error("❌ Erro ao reproduzir áudio:", e)
        setError("Erro ao reproduzir áudio")
        setIsPlaying(false)
        if (!data.audioContent.startsWith("http")) {
          URL.revokeObjectURL(audioUrl)
        }
        setCurrentAudio(null)
      }

      await audio.play()
      setSuccess("✅ Áudio gerado e reproduzido com sucesso!")
      console.log("🎵 Murf.ai TTS: Áudio reproduzindo")
    } catch (err) {
      console.error("❌ Erro no teste TTS:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }

  const testAPIStatus = async () => {
    try {
      setError(null)
      setSuccess(null)

      const response = await fetch("/api/tts")
      const data = await response.json()

      console.log("API Status:", data)

      if (data.hasApiKey) {
        setSuccess(`✅ API configurada! Chave: ${data.apiKeyPreview}...`)
      } else {
        setError("❌ API não configurada. Verifique MURF_TTS_API_KEY")
      }
    } catch (err) {
      setError("❌ Erro ao verificar status da API")
      console.error("Erro:", err)
    }
  }

  return (
    <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-cyan-400" />
          <span>Teste Murf.ai TTS</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">Texto para teste:</label>
          <Input
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Digite o texto para testar..."
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={testMurfTTS}
            disabled={isLoading || !testText.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Gerando..." : isPlaying ? "Parar" : "Testar TTS"}
          </Button>

          <Button onClick={testAPIStatus} variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Verificar API
          </Button>
        </div>

        {error && (
          <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-3">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-3">
          <p className="text-blue-400 text-sm font-medium mb-1">Configuração atual:</p>
          <p className="text-gray-300 text-xs">
            • Endpoint: /api/tts
            <br />• Voz: pt-BR-francisca (Feminina)
            <br />• Estilo: Friendly
            <br />• Provider: Murf.ai
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
