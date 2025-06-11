import { ProjectCard } from "../project-card"

export function ProjectSection() {
  const projectFeatures = [
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      ),
      title: "Conversação por Voz",
      description:
        "Interface intuitiva que permite conversas naturais com IA usando apenas a voz, processamento em tempo real e respostas instantâneas.",
      technologies: ["Web Audio API", "Google Gemini", "Speech Recognition"],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Tecnologia Moderna",
      description:
        "Desenvolvido com as mais recentes tecnologias web, garantindo performance, segurança e uma experiência de usuário excepcional.",
      technologies: ["Next.js 14", "TypeScript", "Tailwind CSS"],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "IA Avançada",
      description:
        "Integração completa com Google Gemini AI para processamento inteligente de linguagem natural e respostas contextuais precisas.",
      technologies: ["Google Gemini", "Machine Learning", "NLP"],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: "Segurança Total",
      description:
        "Processamento de áudio em tempo real sem armazenamento, HTTPS obrigatório e proteção completa da privacidade do usuário.",
      technologies: ["HTTPS", "Real-time Processing", "Privacy First"],
    },
  ]

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-wide text-gradient mb-4">Como Foi Criado</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conheça as tecnologias e recursos por trás do projeto LYKRA
          </p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 opacity-60"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectFeatures.map((feature, index) => (
            <ProjectCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              technologies={feature.technologies}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
