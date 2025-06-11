import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DeveloperSection() {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light tracking-wide text-gradient mb-4">Desenvolvedor</h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-60"></div>
        </div>

        <Card className="bg-card/30 backdrop-blur-sm hover:bg-card/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
          <CardHeader className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-blue-500 mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white shadow-2xl shadow-blue-500/25">
              R
            </div>
            <CardTitle className="text-2xl md:text-3xl text-foreground">Raziel</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Desenvolvedor Front-End & Curioso com a mente da IA
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Aos 17 anos, sou apaixonado por tecnologia e inovação. Dedico meu tempo criando projetos que exploram as
              fronteiras da inteligência artificial e desenvolvimento web, sempre buscando soluções criativas para
              problemas complexos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center group">
                <div className="text-2xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                  17
                </div>
                <div className="text-sm text-muted-foreground">Anos de Idade</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                  Inf
                </div>
                <div className="text-sm text-muted-foreground">Paixão por Tech</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                  Full Stack
                </div>
                <div className="text-sm text-muted-foreground">Foco Principal</div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed italic border-l-2 border-gradient-to-b from-orange-500 to-blue-500 pl-4 bg-gradient-to-r from-white/5 to-transparent p-4 rounded-r-lg">
              "Acredito que a tecnologia tem o poder de transformar o mundo, e estou determinado a fazer parte dessa
              transformação, criando experiências que conectam pessoas e inteligência artificial de forma natural e
              intuitiva."
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
