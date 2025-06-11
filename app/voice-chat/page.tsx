"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, RotateCcw, Volume2, Zap, Brain, Settings, ArrowLeft } from "lucide-react"
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
    currentAudio,
  }
}

// Componente de Visualização de Ondas Fluidas
function FluidWaveVisualizer({
  isRecording,
  isPlaying,
  audioLevel,
  currentAudio,
  isConnected,
  isProcessing,
}: {
  isRecording: boolean
  isPlaying: boolean
  audioLevel: number
  currentAudio: HTMLAudioElement | null
  isConnected: boolean
  isProcessing: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const ttsDataRef = useRef<Uint8Array>(new Uint8Array(128))

  // Configurar análise de áudio do TTS
  useEffect(() => {
    if (isPlaying && currentAudio && canvasRef.current) {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        }

        if (!sourceRef.current) {
          sourceRef.current = audioContextRef.current.createMediaElementSource(currentAudio)
          analyserRef.current = audioContextRef.current.createAnalyser()

          sourceRef.current.connect(analyserRef.current)
          analyserRef.current.connect(audioContextRef.current.destination)

          analyserRef.current.fftSize = 256
        }
      } catch (error) {
        console.error("Erro ao configurar análise de áudio TTS:", error)
      }
    }

    return () => {
      if (!isPlaying && sourceRef.current) {
        sourceRef.current = null
        analyserRef.current = null
      }
    }
  }, [isPlaying, currentAudio])

  // Animação principal das ondas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerY = canvas.height / 2
      const time = Date.now() * 0.001

      // Obter dados de áudio do TTS se disponível
      let ttsLevels: number[] = []
      if (isPlaying && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(ttsDataRef.current)
        ttsLevels = Array.from(ttsDataRef.current).map((v) => v / 255)
      }

      // Determinar intensidade baseada no estado
      let intensity = 0
      if (isProcessing) {
        intensity = 0.7 + Math.sin(time * 5) * 0.3
      } else if (isRecording) {
        intensity = audioLevel * 1.5
      } else if (isPlaying && ttsLevels.length > 0) {
        intensity = ttsLevels.reduce((a, b) => a + b, 0) / ttsLevels.length
      } else if (isConnected) {
        intensity = 0.15 + Math.sin(time * 1.5) * 0.1
      }

      // Definir camadas de ondas com cores quentes
      const layers = [
        {
          color: isRecording
            ? "rgba(255, 69, 0, 0.8)"
            : isPlaying
              ? "rgba(255, 215, 0, 0.9)"
              : "rgba(255, 165, 0, 0.6)",
          amplitude: 60 * intensity,
          frequency: 0.008,
          speed: 2,
          offset: 0,
          blur: 0,
        },
        {
          color: isRecording
            ? "rgba(255, 140, 0, 0.6)"
            : isPlaying
              ? "rgba(255, 165, 0, 0.7)"
              : "rgba(255, 140, 0, 0.4)",
          amplitude: 45 * intensity,
          frequency: 0.012,
          speed: -1.5,
          offset: Math.PI / 3,
          blur: 2,
        },
        {
          color: isRecording
            ? "rgba(255, 99, 71, 0.4)"
            : isPlaying
              ? "rgba(255, 140, 0, 0.5)"
              : "rgba(255, 99, 71, 0.3)",
          amplitude: 35 * intensity,
          frequency: 0.015,
          speed: 3,
          offset: Math.PI / 2,
          blur: 4,
        },
        {
          color: isRecording
            ? "rgba(255, 165, 0, 0.3)"
            : isPlaying
              ? "rgba(255, 99, 71, 0.4)"
              : "rgba(255, 165, 0, 0.2)",
          amplitude: 25 * intensity,
          frequency: 0.02,
          speed: -2.5,
          offset: Math.PI,
          blur: 6,
        },
        {
          color: isRecording
            ? "rgba(255, 215, 0, 0.2)"
            : isPlaying
              ? "rgba(255, 69, 0, 0.3)"
              : "rgba(255, 215, 0, 0.15)",
          amplitude: 15 * intensity,
          frequency: 0.025,
          speed: 1.8,
          offset: Math.PI * 1.5,
          blur: 8,
        },
      ]

      // Desenhar cada camada de onda
      layers.forEach((layer, index) => {
        ctx.save()

        // Aplicar blur se necessário
        if (layer.blur > 0) {
          ctx.filter = `blur(${layer.blur}px)`
        }

        ctx.strokeStyle = layer.color
        ctx.lineWidth = 3 - index * 0.3
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        // Adicionar brilho para camadas principais
        if (index < 2 && intensity > 0.2) {
          ctx.shadowColor = layer.color
          ctx.shadowBlur = 15 - index * 5
        }

        ctx.beginPath()

        // Criar onda suave usando curvas
        for (let x = 0; x <= canvas.width; x += 2) {
          const normalizedX = x / canvas.width

          // Onda base
          let y = centerY

          // Adicionar múltiplas frequências para criar complexidade
          y +=
            Math.sin(normalizedX * Math.PI * 4 * layer.frequency * 100 + time * layer.speed + layer.offset) *
            layer.amplitude *
            0.6
          y +=
            Math.sin(normalizedX * Math.PI * 8 * layer.frequency * 100 + time * layer.speed * 1.3 + layer.offset) *
            layer.amplitude *
            0.3
          y +=
            Math.sin(normalizedX * Math.PI * 16 * layer.frequency * 100 + time * layer.speed * 0.7 + layer.offset) *
            layer.amplitude *
            0.1

          // Modular com dados de áudio se disponível
          if (isPlaying && ttsLevels.length > 0) {
            const dataIndex = Math.floor(normalizedX * ttsLevels.length)
            const audioModulation = ttsLevels[dataIndex] * layer.amplitude * 0.5
            y += Math.sin(normalizedX * Math.PI * 6 + time * 4) * audioModulation
          }

          // Adicionar variação orgânica
          y += Math.sin(normalizedX * Math.PI * 2 + time * 0.8 + layer.offset) * layer.amplitude * 0.2

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()
        ctx.restore()
      })

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRecording, isPlaying, audioLevel, isConnected, isProcessing])

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative bg-black/10 backdrop-blur-sm border border-orange-400/20 rounded-3xl p-8 overflow-hidden">
        {/* Efeito de fundo gradiente */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-400/3 to-transparent" />

        {/* Canvas principal */}
        <canvas
          ref={canvasRef}
          width={1200}
          height={300}
          className="w-full h-40 md:h-48 lg:h-60"
          style={{ background: "transparent" }}
        />

        {/* Indicador de estado */}
        <div className="absolute top-4 left-6 flex items-center space-x-3">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isRecording
                ? "bg-red-400 animate-pulse shadow-lg shadow-red-400/50"
                : isPlaying
                  ? "bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50"
                  : isConnected
                    ? "bg-orange-400 animate-pulse shadow-lg shadow-orange-400/50"
                    : "bg-gray-500"
            }`}
          />
          <span className="text-xs uppercase tracking-widest font-light text-white/60">
            {isRecording
              ? "CAPTURANDO"
              : isPlaying
                ? "SINTETIZANDO"
                : isProcessing
                  ? "PROCESSANDO"
                  : isConnected
                    ? "NEURAL ATIVO"
                    : "OFFLINE"}
          </span>
        </div>

        {/* Partículas flutuantes */}
        {(isRecording || isPlaying) && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full opacity-60"
                style={{
                  background: isRecording ? "#ff8c00" : "#ffd700",
                  left: `${10 + i * 12}%`,
                  top: `${40 + Math.sin(Date.now() * 0.003 + i) * 20}%`,
                  animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
                  boxShadow: `0 0 8px ${isRecording ? "rgba(255,140,0,0.6)" : "rgba(255,215,0,0.6)"}`,
                }}
              />
            ))}
          </div>
        )}

        {/* Linhas decorativas */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />
      </div>
    </div>
  )
}

export default function Lykra() {
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

  // Murf.ai TTS Hook
  const {
    speak: murfSpeak,
    stop: murfStop,
    isPlaying: isSpeaking,
    error: ttsError,
    isMurfTTSAvailable,
    currentAudio: ttsCurrentAudio,
  } = useMurfTTS()

  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-neutral-900 to-stone-900 text-white overflow-hidden relative">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        {/* Morphing Circle 1 */}
        <div
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255,165,0,0.25) 0%, rgba(255,69,0,0.08) 50%, transparent 100%)",
            top: "10%",
            left: "20%",
            animation: "morph1 15s ease-in-out infinite alternate",
          }}
        />

        {/* Morphing Circle 2 */}
        <div
          className="absolute w-80 h-80 rounded-full opacity-15 blur-2xl"
          style={{
            background: "radial-gradient(circle, rgba(255,140,0,0.2) 0%, rgba(255,99,71,0.08) 60%, transparent 100%)",
            top: "60%",
            right: "15%",
            animation: "morph2 18s ease-in-out infinite alternate-reverse",
          }}
        />

        {/* Morphing Circle 3 */}
        <div
          className="absolute w-72 h-72 rounded-full opacity-8 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(255,140,0,0.04) 70%, transparent 100%)",
            bottom: "20%",
            left: "10%",
            animation: "morph3 20s ease-in-out infinite",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="gap-2 flex items-center justify-center">
          <button
                onClick={() => (window.location.href = "/")}
                className="group p-1.5 sm:p-2 text-white/70 hover:text-orange-500 transition-all duration-300 hover:bg-white/5 rounded-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-orange-400/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <ArrowLeft size={18} className="relative z-10" />
              </button>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-[0.2em] text-white">LYKRA</h1>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-lg text-neutral-400 font-light max-w-2xl mx-auto tracking-wide">Interface Neural Fluida</p>
        </div>

        {/* Main Fluid Wave Visualizer */}
        <FluidWaveVisualizer
          isRecording={isRecording}
          isPlaying={isSpeaking}
          audioLevel={audioLevel}
          currentAudio={ttsCurrentAudio}
          isConnected={isConnected}
          isProcessing={isProcessing}
        />

        {/* Status */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-orange-400 animate-pulse" : "bg-neutral-500"}`} />
            <span className="text-sm text-neutral-400 uppercase tracking-widest font-light">
              {isConnected ? "SISTEMA NEURAL ATIVO" : "SISTEMA OFFLINE"}
            </span>
          </div>
          <p className="text-white/80 text-lg font-light leading-relaxed">{status}</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-4 backdrop-blur-sm">
              <p className="text-red-400 text-sm font-light">{error}</p>
            </div>
          )}

          {ttsError && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-6 py-4 backdrop-blur-sm">
              <p className="text-amber-400 text-sm font-light">TTS: {ttsError}</p>
            </div>
          )}
        </div>

        {/* Voice Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-3">
            <Volume2 className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-light tracking-wide">
              {isMurfTTSAvailable === true
                ? `Murf.ai • ${getVoiceName(selectedVoice)} • Friendly`
                : isMurfTTSAvailable === false
                  ? "TTS indisponível"
                  : "Verificando TTS..."}
            </span>
          </div>
        </div>

        {/* Recording Timer */}
        {isRecording && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-8 py-4 backdrop-blur-sm">
            <RecordingTimer isRecording={isRecording} chunkDuration={chunkDuration} />
          </div>
        )}

        {/* AI Response */}
        {lastResponse && (
          <div className="w-full max-w-4xl bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-orange-400 text-sm uppercase tracking-widest font-light">Resposta Neural</span>
            </div>
            <p className="text-white/90 leading-relaxed font-light text-lg">{lastResponse}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center space-x-8">
          <Button
            onClick={resetSession}
            disabled={isRecording}
            variant="outline"
            size="lg"
            className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-500 rounded-2xl px-8 py-4"
          >
            <RotateCcw className="w-5 h-5 mr-3" />
            Reset
          </Button>

          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={!isConnected}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-light px-12 py-4 rounded-2xl transition-all duration-500 shadow-xl shadow-orange-500/25 border-0"
            >
              <Mic className="w-5 h-5 mr-3" />
              Iniciar
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-12 py-4 rounded-2xl transition-all duration-500 shadow-xl shadow-red-500/25 border-0"
            >
              <MicOff className="w-5 h-5 mr-3" />
              Parar
            </Button>
          )}

          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            size="lg"
            className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-500 rounded-2xl px-8 py-4"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Debug Toggle */}
        <Button
          onClick={() => setShowDebug(!showDebug)}
          variant="ghost"
          size="sm"
          className="text-white/30 hover:text-white/50 font-light"
        >
          {showDebug ? "Ocultar" : "Mostrar"} Debug
        </Button>

        {/* Debug Components */}
        {showDebug && (
          <div className="w-full max-w-3xl space-y-6">
            <EnvDebug />
            <TTSTest />
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && !isRecording && isConnected && (
          <div className="w-full max-w-3xl space-y-6">
            <RecordingSettings chunkDuration={chunkDuration} onDurationChange={setChunkDuration} />
            <VoiceSelector selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} />
          </div>
        )}

        {/* Conversation Topics */}
        {!isRecording && isConnected && (
          <div className="w-full max-w-5xl">
            <ConversationTopics onTopicSelect={handleTopicSelect} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-neutral-500 text-xs uppercase tracking-widest font-light">
            Powered by Gemini Neural Network | Bleya IA gemini API
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes morph1 {
          0%, 100% { 
            transform: scale(1) translate(0, 0) rotate(0deg);
            border-radius: 50%;
          }
          25% { 
            transform: scale(1.08) translate(12px, -18px) rotate(90deg);
            border-radius: 60% 40% 30% 70%;
          }
          50% { 
            transform: scale(0.92) translate(-12px, 12px) rotate(180deg);
            border-radius: 30% 60% 70% 40%;
          }
          75% { 
            transform: scale(1.04) translate(18px, 4px) rotate(270deg);
            border-radius: 40% 30% 60% 70%;
          }
        }
        
        @keyframes morph2 {
          0%, 100% { 
            transform: scale(1) translate(0, 0) rotate(0deg);
            border-radius: 50%;
          }
          33% { 
            transform: scale(1.15) translate(-25px, 12px) rotate(120deg);
            border-radius: 70% 30% 50% 50%;
          }
          66% { 
            transform: scale(0.88) translate(18px, -18px) rotate(240deg);
            border-radius: 50% 70% 30% 50%;
          }
        }
        
        @keyframes morph3 {
          0%, 100% { 
            transform: scale(1) translate(0, 0) rotate(0deg);
            border-radius: 50%;
          }
          20% { 
            transform: scale(1.06) translate(10px, -12px) rotate(72deg);
            border-radius: 60% 40% 60% 40%;
          }
          40% { 
            transform: scale(0.94) translate(-15px, 10px) rotate(144deg);
            border-radius: 40% 60% 40% 60%;
          }
          60% { 
            transform: scale(1.1) translate(12px, 15px) rotate(216deg);
            border-radius: 55% 45% 55% 45%;
          }
          80% { 
            transform: scale(0.98) translate(-8px, -6px) rotate(288deg);
            border-radius: 45% 55% 45% 55%;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
