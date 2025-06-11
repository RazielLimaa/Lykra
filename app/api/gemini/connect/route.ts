import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Verificar se a API key está configurada
    const apiKey = process.env.GEMINI_API_KEY 

    if (!apiKey) {
      return NextResponse.json({ error: "API key não configurada" }, { status: 500 })
    }

    // Testar conexão com a API do Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Conectado com sucesso" })
    } else {
      throw new Error("Falha na conexão com Gemini")
    }
  } catch (error) {
    console.error("Erro na conexão Gemini:", error)
    return NextResponse.json({ error: "Erro ao conectar com Gemini" }, { status: 500 })
  }
}
