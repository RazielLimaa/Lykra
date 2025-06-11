import { NextResponse } from "next/server"

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBPz7dtKChfbQnhsthPvFUyI-38DNe065E"

    // Teste simples com texto apenas
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Diga apenas 'Olá! Estou funcionando!' em português.",
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 20,
          },
        }),
      },
    )

    if (response.ok) {
      const result = await response.json()
      return NextResponse.json({
        success: true,
        message: result.candidates?.[0]?.content?.parts?.[0]?.text || "Teste OK",
      })
    } else {
      const error = await response.json()
      return NextResponse.json({
        success: false,
        error: error,
        status: response.status,
      })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: errorMessage })
  }
}
