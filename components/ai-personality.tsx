"use client"

import { Brain } from "lucide-react"

export function AIPersonality() {
  return (
    <div className="w-full max-w-2xl bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <Brain className="w-6 h-6 text-cyan-400" />
        <h3 className="text-cyan-400 text-lg font-light">Personalidade Neural</h3>
      </div>
      <p className="text-white/80 text-sm leading-relaxed font-light">
        Sou uma IA conversacional avançada, projetada para interações naturais e inteligentes. Posso discutir diversos
        tópicos, ajudar com tarefas criativas, fornecer informações e manter conversas envolventes em português
        brasileiro.
      </p>
    </div>
  )
}
