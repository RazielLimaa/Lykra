import { GradientOrb } from "@/components/inicial-page/gradient-orb"
import { WaveShape } from "@/components/inicial-page/wave-shape"
import { ProjectSection } from "@/components/inicial-page/project-section"
import { DeveloperSection } from "@/components/inicial-page/developer-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div
      className="min-h-screen bg-background text-foreground relative overflow-hidden animate-background-move"
      style={{
        background: `radial-gradient(circle at 20% 80%, rgba(30, 58, 138, 0.2) 0%, transparent 50%), 
                       radial-gradient(circle at 80% 20%, rgba(139, 69, 19, 0.2) 0%, transparent 50%), 
                       radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                       radial-gradient(circle at 60% 60%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
                       linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 30, 1) 100%)`,
      }}
    >
      {/* Background Gradient Orbs with mouse following */}
      <GradientOrb
        variant="orange"
        className="top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3"
        followMouse={true}
        intensity={0.25}
        size="xl"
      />
      <GradientOrb
        variant="blue"
        className="bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3"
        followMouse={true}
        intensity={-0.15}
        size="xl"
      />

      {/* Additional smaller orbs with different mouse interactions */}
      <GradientOrb
        variant="orange"
        size="lg"
        className="top-1/4 right-1/4 transform translate-x-1/2 animate-spiral-fast"
        followMouse={true}
        intensity={0.12}
      />
      <GradientOrb
        variant="blue"
        size="md"
        className="bottom-1/4 left-1/4 transform -translate-x-1/2 animate-float"
        followMouse={true}
        intensity={0.18}
      />

      {/* Extra dynamic orbs for more movement */}
      <GradientOrb
        variant="purple"
        size="sm"
        className="top-1/3 left-1/6 animate-pulse-slow"
        followMouse={true}
        intensity={-0.08}
      />
      <GradientOrb
        variant="orange"
        size="md"
        className="bottom-1/3 right-1/6 animate-bounce-slow"
        followMouse={true}
        intensity={0.22}
      />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo/Brand Name */}
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.2em] text-gradient animate-pulse-subtle">
              LYKRA
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-60"></div>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto">
            Experience the future of digital innovation
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Link href="/voice-chat">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 hover:from-orange-500/30 hover:to-blue-500/30 backdrop-blur-sm border border-white/20 text-white px-8 py-4 text-lg font-light tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                TRY IT FOR FREE
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Project Section */}
      <ProjectSection />

      {/* Developer Section */}
      <DeveloperSection />

      {/* Wave Shape Shadow at Bottom */}
      <WaveShape />

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20"></div>
    </div>
  )
}
