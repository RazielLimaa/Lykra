"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Lightbulb, BookOpen, Zap } from "lucide-react"

interface ConversationTopicsProps {
  onTopicSelect: (topic: string) => void
}

export function ConversationTopics({ onTopicSelect }: ConversationTopicsProps) {
  const topics = [
    {
      icon: MessageCircle,
      title: "Conversa Casual",
      prompt: "Vamos ter uma conversa casual e descontraída sobre qualquer assunto interessante.",
    },
    {
      icon: Lightbulb,
      title: "Ideias Criativas",
      prompt: "Me ajude a gerar ideias criativas para um projeto ou problema que estou enfrentando.",
    },
    {
      icon: BookOpen,
      title: "Aprendizado",
      prompt: "Quero aprender algo novo hoje. Pode me ensinar sobre um tópico interessante?",
    },
    {
      icon: Zap,
      title: "Produtividade",
      prompt: "Me dê dicas para ser mais produtivo e organizado no meu dia a dia.",
    },
  ]

  return (
    <div className="w-full space-y-4">
      <h3 className="text-center text-cyan-400 text-sm uppercase tracking-wider">Tópicos Sugeridos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {topics.map((topic, index) => (
          <Button
            key={index}
            onClick={() => onTopicSelect(topic.prompt)}
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 p-4 h-auto"
          >
            <div className="flex items-center space-x-3">
              <topic.icon className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-light">{topic.title}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
