import { NextResponse } from "next/server"

// Importar o cache de conversa (você pode mover isso para um arquivo separado)
const conversationCache = new Map<string, Array<{ role: string; content: string }>>()

export async function POST(request: Request) {
  try {
    const clientId = request.headers.get("x-forwarded-for") || request.headers.get("user-agent") || "default"

    // Limpar histórico da conversa
    conversationCache.delete(clientId)

    return NextResponse.json({
      success: true,
      message: "Histórico de conversa limpo com sucesso",
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao limpar conversa" }, { status: 500 })
  }
}
