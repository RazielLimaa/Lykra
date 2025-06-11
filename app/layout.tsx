import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Falar com Lykra - Conversa por Voz com Inteligência Artificial",
  description: "Converse naturalmente com IA usando sua voz. Powered by Google Gemini.",
  keywords: ["IA", "inteligência artificial", "voz", "conversa", "Gemini", "chat"],
    generator: 'Raziel'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
