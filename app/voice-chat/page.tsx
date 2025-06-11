"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, RotateCcw, Volume2, Settings } from "lucide-react"
import { RateLimitInfo } from "@/components/rate-limit-info"
import { ConversationTopics } from "@/components/conversation-topics"
import { RecordingTimer } from "@/components/recording-timer (1)"
import { RecordingSettings } from "@/components/recording-settings"
import { TTSTest } from "@/components/TSSTest"
import { EnvDebug } from "@/components/.env-debbug"
import { VoiceSelector } from "@/components/voice-selector"

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

const CHUNK_DURATION = 8 // segundos

// Hook do Murf.ai TTS integrado
function useMurfTTS() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [isMurfTTSAvailable, setIsMurfTTSAvailable] = useState<boolean | null>(null)

  // Verificar se a API está disponível
  useEffect(() => {
    const checkAPI = async () => {
      try {
        console.log("🔍 Verificando disponibilidade da API Murf.ai TTS...")
        const response = await fetch("/api/tts")
        if (response.ok) {
          const data = await response.json()
          setIsMurfTTSAvailable(data.hasApiKey)
          console.log("Murf.ai TTS disponível:", data.hasApiKey)
          console.log("Dados da API:", data)
        } else {
          setIsMurfTTSAvailable(false)
          console.log("Murf.ai TTS API não disponível - response not ok")
        }
      } catch (error) {
        console.error("Erro ao verificar Murf.ai TTS API:", error)
        setIsMurfTTSAvailable(false)
      }
    }
    checkAPI()
  }, [])

  const speak = useCallback(
    async (text: string, options: { voice?: string; style?: string; speakingRate?: number } = {}) => {
      try {
        setError(null)
        setIsPlaying(true)

        // Parar áudio atual se estiver tocando
        if (currentAudio) {
          currentAudio.pause()
          currentAudio.currentTime = 0
        }

        console.log("🎵 Tentando usar Murf.ai TTS...")

        const response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            voice: options.voice || "pt-BR-francisca", // Voz feminina portuguesa diferente
            style: options.style || "Friendly",
            speakingRate: options.speakingRate || 1.1,
          }),
        })

        console.log("Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("❌ Erro na resposta:", errorText)

          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch {
            throw new Error(`HTTP ${response.status}: ${errorText}`)
          }

          if (errorData.fallback) {
            throw new Error(errorData.error || "Murf.ai TTS não disponível")
          } else {
            throw new Error(errorData.error || "Erro desconhecido")
          }
        }

        const data = await response.json()
        console.log("✅ Murf.ai TTS: Dados recebidos com sucesso")

        if (!data.audioContent) {
          throw new Error("Nenhum conteúdo de áudio recebido")
        }

        // Verificar se é uma URL ou base64
        let audioUrl: string
        if (data.audioContent.startsWith("http")) {
          // É uma URL direta
          audioUrl = data.audioContent
        } else {
          // É base64, converter para blob
          const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0))], {
            type: "audio/mp3",
          })
          audioUrl = URL.createObjectURL(audioBlob)
        }

        const audio = new Audio(audioUrl)
        setCurrentAudio(audio)

        // Configurar eventos do áudio
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

        // Reproduzir o áudio
        await audio.play()
        console.log("🎵 Murf.ai TTS: Áudio reproduzindo")
      } catch (err) {
        console.error("❌ Erro no Murf.ai TTS:", err)
        setError(err instanceof Error ? err.message : "Erro desconhecido")
        setIsPlaying(false)

        // Fallback DESABILITADO - não usar speechSynthesis
        console.log("❌ Murf.ai TTS falhou. Fallback desabilitado.")
        setError("Murf.ai TTS não disponível. Verifique a configuração da API.")
      }
    },
    [currentAudio],
  )

  const stop = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setIsPlaying(false)
    }
  }, [currentAudio])

  return {
    speak,
    stop,
    isPlaying,
    error,
    isMurfTTSAvailable,
  }
}

export default function FalarComIA() {
  const [isRecording, setIsRecording] = useState(false)
  const [status, setStatus] = useState('Clique em "Iniciar" para começar a conversar')
  const [error, setError] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [lastResponse, setLastResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [chunkDuration, setChunkDuration] = useState(8) // 8 segundos por padrão
  const [showSettings, setShowSettings] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState("pt-BR-francisca") // Nova voz padrão
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Murf.ai TTS Hook
  const { speak: murfSpeak, stop: murfStop, isPlaying: isSpeaking, error: ttsError, isMurfTTSAvailable } = useMurfTTS()

  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  // Track mouse position for interactive light
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const connectToGemini = useCallback(async () => {
    try {
      setStatus("Conectando com a IA...")

      const response = await fetch("/api/gemini/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setIsConnected(true)
        setStatus("Conectado! Pronto para conversar.")
      } else {
        throw new Error("Falha na conexão")
      }
    } catch (err) {
      setError("Erro ao conectar com a IA")
      console.error(err)
    }
  }, [])

  const startRecording = async () => {
    if (isRecording) return

    try {
      setStatus("Solicitando acesso ao microfone...")
      setError("")

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })

      mediaStreamRef.current = stream

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / bufferLength
          setAudioLevel(average / 255)
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
        }
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0 && !isProcessing) {
          setIsProcessing(true)
          setStatus("🤔 Processando...")

          const reader = new FileReader()
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(",")[1]

            try {
              const response = await fetch("/api/gemini/process-audio", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  audioData: base64Audio,
                  mimeType: "audio/webm;codecs=opus",
                }),
              })

              const result = await response.json()

              if (response.status === 429 || result.rateLimited) {
                setStatus("⏳ Muitas solicitações. Aguarde alguns segundos...")
                setError("Rate limit atingido. Aguarde antes de continuar.")
                setTimeout(() => {
                  setError("")
                  setStatus("Pronto para continuar.")
                }, 5000)
              } else if (result.textResponse) {
                playAudioResponse(result.textResponse)
                if (result.fallback) {
                  setStatus("⚠️ Resposta limitada devido à cota da API")
                }
              }
            } catch (error) {
              console.error("Erro ao processar áudio:", error)
              setError("Erro de conexão. Verifique sua internet.")
              setStatus("Erro de conexão. Tente novamente.")
            } finally {
              setIsProcessing(false)
            }
          }
          reader.readAsDataURL(event.data)
        }
      }

      mediaRecorderRef.current.start(chunkDuration * 1000)
      setIsRecording(true)
      setStatus(`🔴 Gravando... Você tem ${chunkDuration} segundos para falar!`)
      updateAudioLevel()
    } catch (err) {
      console.error("Erro ao iniciar gravação:", err)
      setError("Erro ao acessar o microfone. Verifique as permissões.")
      setStatus("Erro ao iniciar gravação")
    }
  }

  const stopRecording = () => {
    if (!isRecording) return

    setStatus("Parando gravação...")
    setIsRecording(false)

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    setAudioLevel(0)
    setStatus('Gravação finalizada. Clique em "Iniciar" para gravar novamente.')
  }

  const clearConversation = async () => {
    try {
      await fetch("/api/gemini/clear-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      setLastResponse("")
      setStatus("Conversa reiniciada!")
    } catch (error) {
      console.error("Erro ao limpar conversa:", error)
    }
  }

  const resetSession = () => {
    stopRecording()
    clearConversation()
    setIsConnected(false)
    setError("")
    setStatus('Sessão reiniciada. Clique em "Conectar" para começar.')
  }

  useEffect(() => {
    connectToGemini()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      stopRecording()
    }
  }, [connectToGemini])

  const playAudioResponse = async (textResponse: string) => {
    setLastResponse(textResponse)
    setStatus("💬 Resposta recebida")

    try {
      setStatus("🔊 Gerando áudio...")

      await murfSpeak(textResponse, {
        voice: selectedVoice, // Usar a voz selecionada
        style: "Friendly",
        speakingRate: 1.1,
      })

      setStatus("🔊 Falando...")

      // Aguardar o fim da reprodução
      const checkIfFinished = setInterval(() => {
        if (!isSpeaking) {
          setStatus("Resposta concluída. Continue a conversa.")
          clearInterval(checkIfFinished)
        }
      }, 500)
    } catch (error) {
      console.error("Erro no TTS:", error)
      setStatus("Erro na reprodução de áudio.")
    }
  }

  const handleTopicSelect = (topicPrompt: string) => {
    setLastResponse(topicPrompt)
    playAudioResponse(topicPrompt)
  }

  const getVoiceName = (voiceId: string) => {
    const voiceMap: { [key: string]: string } = {
      "pt-BR-francisca": "Francisca",
      "pt-BR-camila": "Camila",
      "pt-BR-isabella": "Isabella",
      "pt-BR-sofia": "Sofia",
      "pt-BR-eloa": "Eloa",
      "pt-BR-maria": "Maria",
    }
    return voiceMap[voiceId] || "Francisca"
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Interactive Mouse Light */}
      <div
        className="fixed pointer-events-none z-0 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255,140,0,0.15) 0%, rgba(255,69,0,0.08) 30%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />

      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Minimal Grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,140,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,140,0,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 space-y-12">
        {/* Minimal Header */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl md:text-8xl font-thin tracking-[0.2em] text-white">LYKRA</h1>
          <p className="text-lg text-gray-400 font-light">Neural Interface</p>
        </div>

        {/* Clean Audio Visualizer */}
        <div className="relative">
          <MinimalAudioVisualizer
            audioLevel={audioLevel}
            isRecording={isRecording}
            isConnected={isConnected}
            isProcessing={isProcessing}
          />
        </div>

        {/* Status */}
        <div className="text-center space-y-4 max-w-md">
          <div className="flex items-center justify-center space-x-3">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isConnected ? "bg-orange-500" : "bg-gray-500"
              }`}
            />
            <span className="text-sm text-gray-400 uppercase tracking-wider">{isConnected ? "Online" : "Offline"}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{status}</p>
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{error}</p>
          )}
          {ttsError && (
            <p className="text-orange-400 text-sm bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/20">
              {ttsError}
            </p>
          )}
        </div>

        {/* Voice Info */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2">
          <div className="flex items-center justify-center space-x-2">
            <Volume2 className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 text-sm">
              {isMurfTTSAvailable === true
                ? `${getVoiceName(selectedVoice)} • Murf.ai`
                : isMurfTTSAvailable === false
                  ? "TTS Unavailable"
                  : "Checking..."}
            </span>
          </div>
        </div>

        {/* Recording Timer */}
        {isRecording && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-6 py-3">
            <RecordingTimer isRecording={isRecording} chunkDuration={chunkDuration} />
          </div>
        )}

        {/* AI Response */}
        {lastResponse && (
          <div className="w-full max-w-2xl bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-orange-400 text-sm uppercase tracking-wider">Response</span>
            </div>
            <p className="text-gray-100 leading-relaxed">{lastResponse}</p>
          </div>
        )}

        {/* Clean Controls */}
        <div className="flex items-center space-x-6">
          <Button
            onClick={resetSession}
            disabled={isRecording}
            variant="ghost"
            size="lg"
            className="text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>

          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={!isConnected}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-black font-medium px-8 py-3 rounded-full transition-colors duration-200"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full transition-colors duration-200"
            >
              <MicOff className="w-5 h-5 mr-2" />
              Stop
            </Button>
          )}

          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="lg"
            className="text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Debug Toggle */}
        <Button
          onClick={() => setShowDebug(!showDebug)}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-300 text-xs"
        >
          {showDebug ? "Hide" : "Show"} Debug
        </Button>

        {/* Debug Components */}
        {showDebug && (
          <div className="w-full max-w-2xl space-y-4">
            <EnvDebug />
            <TTSTest />
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && !isRecording && isConnected && (
          <div className="w-full max-w-2xl space-y-4">
            <RecordingSettings chunkDuration={chunkDuration} onDurationChange={setChunkDuration} />
            <VoiceSelector selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} />
          </div>
        )}

        {/* Conversation Topics */}
        {!isRecording && isConnected && (
          <div className="w-full max-w-4xl">
            <ConversationTopics onTopicSelect={handleTopicSelect} />
          </div>
        )}

        {/* Rate Limit Info */}
        <RateLimitInfo />

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-gray-600 text-xs">Powered by Gemini</p>
        </div>
      </div>
    </div>
  )
}

// Minimal Audio Visualizer
function MinimalAudioVisualizer({
  audioLevel,
  isRecording,
  isConnected,
  isProcessing,
}: {
  audioLevel: number
  isRecording: boolean
  isConnected: boolean
  isProcessing: boolean
}) {
  const intensity = isRecording ? audioLevel : 0
  const pulseIntensity = isProcessing ? 0.6 : intensity

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer Ring */}
      <div
        className="absolute inset-0 rounded-full border transition-all duration-300"
        style={{
          borderColor: isConnected ? "#f97316" : "#374151",
          borderWidth: "1px",
          boxShadow: isConnected ? `0 0 ${20 + pulseIntensity * 30}px rgba(249,115,22,0.3)` : "none",
          transform: `scale(${1 + pulseIntensity * 0.05})`,
        }}
      />

      {/* Inner Ring */}
      <div
        className="absolute inset-8 rounded-full border transition-all duration-200"
        style={{
          borderColor: isRecording ? "#ea580c" : "rgba(249,115,22,0.2)",
          borderWidth: "1px",
          transform: `scale(${1 + pulseIntensity * 0.1})`,
        }}
      />

      {/* Core */}
      <div
        className="absolute inset-16 rounded-full transition-all duration-150"
        style={{
          background: isRecording
            ? `radial-gradient(circle, rgba(234,88,12,${0.3 + pulseIntensity * 0.4}) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(249,115,22,${0.2 + pulseIntensity * 0.3}) 0%, transparent 70%)`,
          transform: `scale(${1 + pulseIntensity * 0.2})`,
        }}
      />

      {/* Center Dot */}
      <div
        className="absolute w-3 h-3 rounded-full transition-all duration-100"
        style={{
          background: isRecording ? "#ea580c" : "#f97316",
          boxShadow: `0 0 ${10 + pulseIntensity * 15}px ${isRecording ? "rgba(234,88,12,0.6)" : "rgba(249,115,22,0.4)"}`,
          transform: `scale(${1 + pulseIntensity * 0.3})`,
        }}
      />
    </div>
  )
}
