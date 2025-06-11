import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    console.log("=== INÍCIO DA REQUISIÇÃO TTS ===")

    const body = await request.json()
    const { text, voice = "pt-BR-francisca", style = "Friendly" } = body

    console.log("Dados recebidos:", { text: text?.substring(0, 50), voice, style })

    if (!text) {
      console.log("❌ Texto não fornecido")
      return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 })
    }

    // === VERIFICAÇÃO DA API KEY ===
    const murfApiKey = process.env.MURF_TTS_API_KEY
    console.log("Murf API key existe:", !!murfApiKey)

    // === TENTAR USAR ELEVENLABS COMO FALLBACK ===
    console.log("🔄 Usando ElevenLabs como fallback...")

    // Mapeamento de vozes do Murf para ElevenLabs
    const voiceMap: Record<string, string> = {
      "pt-BR-francisca": "21m00Tcm4TlvDq8ikWAM", // Rachel
      "pt-BR-isadora": "EXAVITQu4vr4xnSDxMaL", // Bella
      "pt-BR-camila": "D38z5RcWu1voky8WS1ja", // Elli
      "pt-BR-eloa": "jBpfuIE2acCO8z3wKNLl", // Grace
      default: "21m00Tcm4TlvDq8ikWAM", // Rachel (default)
    }

    // Determinar a voz do ElevenLabs
    const elevenLabsVoiceId = voiceMap[voice] || voiceMap.default

    // Configurar a requisição para o ElevenLabs
    const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
        "xi-api-key": process.env.ELEVEN_LABS_API_KEY ?? "",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    })

    console.log("ElevenLabs response status:", elevenLabsResponse.status)

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text()
      console.error("❌ Erro da API ElevenLabs:", errorText)

      // Fallback para síntese de voz básica
      console.log("🔄 Usando síntese de voz básica como último recurso...")

      // Gerar um áudio simples usando uma API pública
      const basicTtsResponse = await fetch(
        `https://api.streamelements.com/kappa/v2/speech?voice=Camila&text=${encodeURIComponent(text)}`,
      )

      if (!basicTtsResponse.ok) {
        return NextResponse.json(
          {
            error: "Falha em todos os serviços de TTS",
            fallback: true,
          },
          { status: 500 },
        )
      }

      // Converter o áudio para base64
      const audioBuffer = await basicTtsResponse.arrayBuffer()
      const audioBase64 = Buffer.from(audioBuffer).toString("base64")

      return NextResponse.json({
        audioContent: audioBase64,
        success: true,
        provider: "StreamElements TTS",
        voice: "Camila",
      })
    }

    // Processar a resposta do ElevenLabs
    const audioBuffer = await elevenLabsResponse.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString("base64")

    return NextResponse.json({
      audioContent: audioBase64,
      success: true,
      provider: "ElevenLabs",
      voice: elevenLabsVoiceId,
    })
  } catch (error) {
    console.error("❌ Erro interno:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        fallback: true,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  const murfApiKey = process.env.MURF_TTS_API_KEY

  return NextResponse.json({
    message: "TTS API Status",
    murfApiKeyExists: !!murfApiKey,
    murfApiKeyLength: murfApiKey?.length || 0,
    provider: "ElevenLabs (Fallback)",
    status: "Usando ElevenLabs como alternativa ao Murf.ai",
  })
}
