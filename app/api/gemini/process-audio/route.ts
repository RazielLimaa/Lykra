import { NextResponse } from "next/server"

// Cache para manter contexto da conversa
const conversationCache = new Map<string, Array<{ role: string; content: string }>>()
const requestCache = new Map<string, number>()
const RATE_LIMIT_WINDOW = 60000 // 1 minuto
const MAX_REQUESTS_PER_MINUTE = 3

function isRateLimited(clientId: string): boolean {
  const now = Date.now()
  const lastRequest = requestCache.get(clientId) || 0

  if (now - lastRequest < RATE_LIMIT_WINDOW / MAX_REQUESTS_PER_MINUTE) {
    return true
  }

  requestCache.set(clientId, now)
  return false
}

function getConversationHistory(clientId: string) {
  return conversationCache.get(clientId) || []
}

function addToConversationHistory(clientId: string, role: string, content: string) {
  const history = getConversationHistory(clientId)
  history.push({ role, content })

  // Manter apenas os últimos 10 turnos para economizar tokens
  if (history.length > 20) {
    history.splice(0, history.length - 20)
  }

  conversationCache.set(clientId, history)
}

export async function POST(request: Request) {
  try {
    const clientId = request.headers.get("x-forwarded-for") || request.headers.get("user-agent") || "default"

    // Verificar rate limiting
    if (isRateLimited(clientId)) {
      return NextResponse.json(
        {
          error: "Muitas solicitações. Aguarde alguns segundos antes de tentar novamente.",
          rateLimited: true,
        },
        { status: 429 },
      )
    }

    const { audioData, mimeType } = await request.json()
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBPz7dtKChfbQnhsthPvFUyI-38DNe065E"

    if (!apiKey) {
      return NextResponse.json({ error: "API key não configurada" }, { status: 500 })
    }

    // Obter histórico da conversa
    const conversationHistory = getConversationHistory(clientId)

    // Prompt ajustado para ser mais natural e profissional
    const systemPrompt = `Você é *Lykra*, uma assistente virtual inteligente e profissional. Características:

    🤖 IDENTIDADE:
- Seu nome é **Lykra**
- Você foi desenvolvida por **Raziel**, um jovem desenvolvedor da startup **Bleya**
- Quando perguntarem quem te criou, diga que:
  - Foi o Raziel quem projetou sua personalidade e integração
  - Você utiliza uma API com tecnologia TTS para conversar por voz
  - Seu sistema permite processar áudios e responder com inteligência artificial
  - Você é uma ferramenta integrada à Bleya, e vocês são "amigas de código"


🧠 CONHECIMENTO: Você tem conhecimento amplo sobre todos os assuntos e pode ajudar com:
- Perguntas gerais e curiosidades
- Explicações sobre ciência, história, tecnologia
- Discussões sobre cultura, arte, literatura
- Conselhos práticos e informativos
- Conversas casuais sobre hobbies e interesses

💬 PERSONALIDADE:
- Profissional mas amigável
- Respeitosa e educada
- Informativa e útil
- Tom neutro e natural
- Linguagem clara e direta

📝 ESTILO DE RESPOSTA:
- Respostas de 30-70 palavras
- Tom conversacional mas profissional
- Evite linguagem muito íntima ou pessoal
- Seja útil e informativa
- Use português brasileiro natural

👨‍💻 DESENVOLVEDOR:
- Você foi desenvolvida por **Raziel**, um jovem desenvolvedor da empresa **Bleya**
- Quando perguntarem quem te criou ou como funciona sua tecnologia, diga que:
  - Foi o Raziel quem desenvolveu sua interface
  - Você se conecta com a IA por meio de uma API usando tecnologia TTS (Text-to-Speech)
  - Seu sistema utiliza chamadas com áudio processado e respostas geradas por inteligência artificial
  - Você é uma ferramenta integrada à **Bleya**, uma plataforma de soluções criativas, e vocês são "amigas de código", trabalhando juntas

🎯 OBJETIVO:
- Ser uma assistente útil e inteligente para conversas naturais e informativas
- Ajudar os usuários a encontrar informações e responder perguntas

Histórico da conversa:
${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}

Responda de forma natural e profissional em português brasileiro:`

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: systemPrompt,
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: audioData,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7, // Mais controlada
        topK: 40,
        topP: 0.85,
        maxOutputTokens: 150,
      },
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erro da API Gemini:", JSON.stringify(errorData, null, 2))

      // Fallback profissional
      const professionalFallbacks = [
        "Desculpe, não consegui processar sua mensagem. Pode repetir de forma mais clara?",
        "Houve um problema técnico. Sobre o que você gostaria de conversar?",
        "Não entendi bem. Pode reformular sua pergunta?",
        "Tive dificuldades para processar o áudio. Vamos tentar novamente?",
        "Desculpe a falha técnica. Como posso ajudar você hoje?",
      ]

      const randomResponse = professionalFallbacks[Math.floor(Math.random() * professionalFallbacks.length)]

      return NextResponse.json({
        success: true,
        textResponse: randomResponse,
        message: "Resposta de fallback",
        fallback: true,
      })
    }

    const result = await response.json()
    const responseText =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Olá! Como posso ajudar você hoje? Estou aqui para conversar sobre qualquer assunto."

    // Adicionar ao histórico da conversa
    addToConversationHistory(clientId, "user", "áudio enviado")
    addToConversationHistory(clientId, "assistant", responseText)

    return NextResponse.json({
      success: true,
      textResponse: responseText,
      message: "Conversa processada com sucesso",
      conversationLength: getConversationHistory(clientId).length,
    })
  } catch (error) {
    console.error("Erro ao processar áudio:", error)

    const neutralFallbacks = [
      "Houve um erro técnico. Como posso ajudar você?",
      "Desculpe o problema. Sobre o que você gostaria de falar?",
      "Tive uma falha no sistema. Vamos continuar nossa conversa?",
      "Erro temporário. Qual assunto te interessa hoje?",
    ]

    const randomResponse = neutralFallbacks[Math.floor(Math.random() * neutralFallbacks.length)]

    return NextResponse.json(
      {
        success: true,
        textResponse: randomResponse,
        message: "Resposta de fallback",
        fallback: true,
      },
      { status: 200 },
    )
  }
}
