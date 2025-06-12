"use client"
import { useState, useEffect, useRef } from "react"

export default function ExplosionPage() {
  const [phase, setPhase] = useState("fadeIn")
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [showBlackFade, setShowBlackFade] = useState(false)
  const [showFlowers, setShowFlowers] = useState(false)
  const [showSunMoonPoem, setShowSunMoonPoem] = useState(false)
  const [currentSunLine, setCurrentSunLine] = useState(0)
  const [currentMoonLine, setCurrentMoonLine] = useState(0)
  const [sunPoemComplete, setSunPoemComplete] = useState(false)
  const [moonPoemComplete, setMoonPoemComplete] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [audioMinimized, setAudioMinimized] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  const poemLines = [
    "Ela não precisa brilhar como o Sol,",
    "Pois sua luz vem de dentro —",
    "calma, constante, completa.",
    "É silêncio que acalma,",
    "é presença que aquece.",
    "",
    "Quando o mundo escurece,",
    "é ela quem guia meus olhos,",
    "com uma luz que não cega,",
    "mas abraça.",
    "",
    "Ela é a Lua:",
    "não grita, não arde — encanta.",
    "Seus ciclos não são falhas,",
    "são danças sagradas",
    "que me ensinam a esperar,",
    "a entender o tempo do amor.",
    "",
    "Ela some às vezes,",
    "mas mesmo escondida,",
    "eu sei —",
    "ela está lá.",
    "",
    "E eu, Sol inquieto,",
    "me curvo diante da sua maré.",
    "Em cada noite,",
    "derramo minha luz só pra vê-la sorrir.",
    "",
    "Porque amar ela",
    "é entender que não preciso brilhar mais forte,",
    "só preciso existir perto,",
    "na órbita certa,",
    "e sentir o mundo mais bonito",
    "só por tê-la no meu céu.",
  ]

  const sunPoem = [
    "Chamas que nascem com propósito calmo,",
    "Derramam luz só pra vê-la brilhar.",
    "O dia se faz no toque de sua alma,",
    "E todo calor existe pra lhe amar.",
    "",
    "Horizontes se curvam em silêncio sereno,",
    "Num gesto terno de eterna devoção.",
    "Mesmo distante, seu brilho pequeno",
    "Guia com doçura meu coração.",
    "",
    "Cada raio é um verso não dito,",
    "Cada pôr, uma promessa guardada.",
    "No ciclo do tempo infinito,",
    "Ama-se uma lua — sempre esperada.",
  ]

  const moonPoem = [
    "Prata que dança entre véus da noite,",
    "Desenha caminhos no céu escuro.",
    "Em cada fase, um abraço que acoite",
    "A ausência de um amor tão puro.",
    "",
    "Mesmo quando o mundo adormece,",
    "Seu calor ainda pulsa em mim.",
    "Há silêncio, mas o peito agradece,",
    "Pois sei que ele me ama, enfim.",
    "",
    "Marés se erguem ao seu chamado,",
    "Flor da aurora que nunca se apaga.",
    "Mesmo invisível, é sempre amado —",
    "Sol que vive onde meu peito se alaga.",
  ]

  // Enable audio on first user interaction
  const enableAudio = () => {
    setAudioEnabled(true)
  }

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("starBirth"), 2000)
    const timer2 = setTimeout(() => setPhase("starLife"), 6000)
    const timer3 = setTimeout(() => setPhase("preExplosion"), 10000)
    const timer4 = setTimeout(() => {
      setPhase("explosion")
      // Start music when explosion begins
      if (audioEnabled && audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(console.error)
      }
    }, 16000)
    const timer5 = setTimeout(() => setPhase("aftermath"), 20000)
    const timer6 = setTimeout(() => setPhase("whiteOut"), 24000)
    const timer7 = setTimeout(() => setPhase("poem"), 26000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
      clearTimeout(timer6)
      clearTimeout(timer7)
    }
  }, [audioEnabled])

  useEffect(() => {
    if (phase === "poem") {
      const interval = setInterval(() => {
        setCurrentLineIndex((prev) => {
          if (prev < poemLines.length - 1) {
            return prev + 1
          } else {
            clearInterval(interval)
            setTimeout(() => {
              setShowBlackFade(true)
              setTimeout(() => {
                setShowFlowers(true)
                // Start sun/moon poem after flowers appear
                setTimeout(() => {
                  setShowSunMoonPoem(true)
                }, 3000)
              }, 3000)
            }, 2000)
            return prev
          }
        })
      }, 2500)

      return () => clearInterval(interval)
    }
  }, [phase, poemLines.length])

  useEffect(() => {
    if (showSunMoonPoem) {
      const sunInterval = setInterval(() => {
        setCurrentSunLine((prev) => {
          if (prev < sunPoem.length - 1) {
            return prev + 1
          } else {
            setSunPoemComplete(true)
            clearInterval(sunInterval)
            return prev
          }
        })
      }, 2000)

      // Start moon poem with slight delay
      const moonTimer = setTimeout(() => {
        const moonInterval = setInterval(() => {
          setCurrentMoonLine((prev) => {
            if (prev < moonPoem.length - 1) {
              return prev + 1
            } else {
              setMoonPoemComplete(true)
              clearInterval(moonInterval)
              return prev
            }
          })
        }, 2000)
      }, 1000)

      return () => {
        clearInterval(sunInterval)
        clearTimeout(moonTimer)
      }
    }
  }, [showSunMoonPoem, sunPoem.length, moonPoem.length])

  return (
    <div className="min-h-screen relative overflow-hidden bg-black" onClick={enableAudio}>
    {/* Audio Element - Replace src with your music file */}
      <audio ref={audioRef} loop preload="auto" className="hidden">
        <source src="/oceano-djavan.mp3" type="audio/mpeg" />
        <source src="/oceano-djavan.ogg" type="audio/ogg" />
        {/* Fallback message */}
        Seu navegador não suporta o elemento de áudio.
      </audio>

      {/* Audio Enable Prompt */}
      {!audioEnabled && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 text-white px-2 py-3 rounded-full backdrop-blur-sm border border-white/20">
          <p className="text-sm font-light">🎵 Clique para começar a musica!</p>
        </div>
      )}

      {/* Beautiful Music Player - Full View */}
      {audioEnabled && !audioMinimized && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-2xl">
            {/* Music Note Icon */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <div className="text-white/90 text-sm font-light">
                <div className="font-medium">Oceano</div>
                <div className="text-xs text-white/60">Djavan</div>
              </div>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (audioRef.current) {
                  if (audioRef.current.paused) {
                    audioRef.current.play()
                  } else {
                    audioRef.current.pause()
                  }
                }
              }}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 group"
            >
              {audioRef.current?.paused !== false ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              )}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="opacity-60">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.7"
                onChange={(e) => {
                  if (audioRef.current) {
                    audioRef.current.volume = Number.parseFloat(e.target.value)
                  }
                }}
                className="w-16 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Minimize Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setAudioMinimized(true)
              }}
              className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" className="opacity-60">
                <path d="M19 13H5v-2h14v2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Minimized Audio Player - Small Circle */}
      {audioEnabled && audioMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setAudioMinimized(false)
            }}
            className="w-12 h-12 bg-black/50 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Fade In White */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-white via-pink-50 to-purple-50 transition-opacity duration-2000 ${
          phase === "fadeIn" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Cosmic Background - Pure Black with Stars */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-3000 ${
          phase === "starBirth" ||
          phase === "starLife" ||
          phase === "preExplosion" ||
          phase === "explosion" ||
          phase === "aftermath"
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        {/* Static Twinkling Background Stars */}
        <div className="absolute inset-0">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${0.5 + Math.random() * 1.5}px`,
                height: `${0.5 + Math.random() * 1.5}px`,
                boxShadow: `0 0 ${1 + Math.random() * 3}px rgba(255, 255, 255, 0.6)`,
                animation: `subtleTwinkle ${3 + Math.random() * 4}s infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        {/* Main Star Container */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* Star Birth & Life Phases */}
          {(phase === "starBirth" || phase === "starLife" || phase === "preExplosion") && (
            <div className="relative">
              {/* Main Star Core */}
              <div
                className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full relative"
                style={{
                  background: `
                    radial-gradient(circle at 30% 30%, 
                      rgba(255, 255, 255, 1) 0%,
                      rgba(255, 240, 120, 0.95) 15%,
                      rgba(255, 180, 60, 0.9) 35%,
                      rgba(255, 120, 40, 0.8) 55%,
                      rgba(220, 60, 20, 0.6) 75%,
                      rgba(180, 20, 10, 0.3) 90%,
                      transparent 100%
                    )
                  `,
                  filter: `blur(2px)`,
                  boxShadow: `
                    0 0 80px rgba(255, 255, 255, 0.8),
                    0 0 160px rgba(255, 240, 120, 0.6),
                    0 0 240px rgba(255, 180, 60, 0.4),
                    0 0 320px rgba(255, 120, 40, 0.3),
                    inset 0 0 100px rgba(255, 255, 255, 0.2)
                  `,
                  animation: `starPulse 4s ease-in-out infinite, starRotate 30s linear infinite`,
                }}
              />
            </div>
          )}

          {/* Pre-Explosion Instability */}
          {phase === "preExplosion" && (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: `${150 + i * 60}px`,
                    height: `${150 + i * 60}px`,
                    background: `radial-gradient(circle, transparent 70%, rgba(255, 100, 100, 0.6) 85%, transparent 100%)`,
                    filter: `blur(${5 + i * 2}px)`,
                    animation: `instabilityPulse 0.8s ease-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Main Explosion */}
          {(phase === "explosion" || phase === "aftermath") && (
            <div className="relative">
              {/* Core Explosion - Bright Flash */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: `200px`,
                  height: `200px`,
                  background: `
                    radial-gradient(circle,
                      rgba(255, 255, 255, 1) 0%,
                      rgba(255, 255, 200, 0.95) 10%,
                      rgba(255, 200, 100, 0.9) 25%,
                      rgba(255, 150, 50, 0.8) 45%,
                      rgba(255, 100, 0, 0.6) 65%,
                      rgba(200, 50, 0, 0.4) 80%,
                      transparent 100%
                    )
                  `,
                  filter: `blur(8px)`,
                  boxShadow: `
                    0 0 300px rgba(255, 255, 255, 0.9),
                    0 0 600px rgba(255, 200, 100, 0.7),
                    0 0 900px rgba(255, 150, 50, 0.5),
                    0 0 1200px rgba(255, 100, 0, 0.3)
                  `,
                  animation: `explosionCore 5s ease-out forwards`,
                }}
              />
              {/* Cosmic Shockwave Rings */}
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: `200px`,
                    height: `200px`,
                    background: `radial-gradient(circle, transparent 85%, rgba(100, 200, 255, 0.3) 95%, transparent 100%)`,
                    filter: `blur(${8 + i * 2}px)`,
                    animation: `cosmicShockwave ${8 + i * 0.8}s ease-out forwards`,
                    animationDelay: `${i * 0.6}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* White Out Transition */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-white via-pink-50 to-purple-50 transition-opacity duration-3000 ${
          phase === "whiteOut" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Poem Scene */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center transition-all duration-3000 ${
          phase === "poem" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Poem Lines with Fade Animation */}
          <div className="relative min-h-[200px] flex items-center justify-center">
            {poemLines.map((line, index) => (
              <div
                key={index}
                className={`absolute text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-relaxed text-gray-800 font-serif text-center whitespace-pre-wrap drop-shadow-lg transition-opacity duration-1000 px-4 ${
                  index === currentLineIndex ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Black Fade Transition */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-3000 ${
          showBlackFade ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Magical Flower Garden */}
      {showFlowers && (
        <div className="absolute inset-0 magical-garden">
          <div className="flowers">
            {/* Flower 1 */}
            <div className="flower flower--1">
              <div className="flower__leafs flower__leafs--1">
                <div className="flower__leaf flower__leaf--1"></div>
                <div className="flower__leaf flower__leaf--2"></div>
                <div className="flower__leaf flower__leaf--3"></div>
                <div className="flower__leaf flower__leaf--4"></div>
                <div className="flower__white-circle"></div>

                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`flower__light flower__light--${i + 1}`}></div>
                ))}
              </div>
              <div className="flower__line">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`}></div>
                ))}
              </div>
            </div>

            {/* Flower 2 */}
            <div className="flower flower--2">
              <div className="flower__leafs flower__leafs--2">
                <div className="flower__leaf flower__leaf--1"></div>
                <div className="flower__leaf flower__leaf--2"></div>
                <div className="flower__leaf flower__leaf--3"></div>
                <div className="flower__leaf flower__leaf--4"></div>
                <div className="flower__white-circle"></div>

                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`flower__light flower__light--${i + 1}`}></div>
                ))}
              </div>
              <div className="flower__line">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`}></div>
                ))}
              </div>
            </div>

            {/* Flower 3 */}
            <div className="flower flower--3">
              <div className="flower__leafs flower__leafs--3">
                <div className="flower__leaf flower__leaf--1"></div>
                <div className="flower__leaf flower__leaf--2"></div>
                <div className="flower__leaf flower__leaf--3"></div>
                <div className="flower__leaf flower__leaf--4"></div>
                <div className="flower__white-circle"></div>

                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`flower__light flower__light--${i + 1}`}></div>
                ))}
              </div>
              <div className="flower__line">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sun and Moon Poem - Responsive Layout */}
      {showSunMoonPoem && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Desktop Layout - Side by Side */}
          <div className="hidden lg:block">
            {/* Sun Poem - Far Left */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-80">
              <div className="mb-6">
                <h2 className="text-4xl font-serif text-yellow-300 mb-4 drop-shadow-lg sun-glow">Sol</h2>
              </div>
              <div className="space-y-3">
                {sunPoem.map((line, index) => (
                  <div
                    key={index}
                    className={`text-lg leading-relaxed text-yellow-100 font-serif transition-all duration-1000 typewriter sun-text-glow ${
                      index <= currentSunLine ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Moon Poem - Far Right */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-80 text-right">
              <div className="mb-6">
                <h2 className="text-4xl font-serif text-blue-300 mb-4 drop-shadow-lg moon-glow">Lua</h2>
              </div>
              <div className="space-y-3">
                {moonPoem.map((line, index) => (
                  <div
                    key={index}
                    className={`text-lg leading-relaxed text-blue-100 font-serif transition-all duration-1000 typewriter moon-text-glow ${
                      index <= currentMoonLine ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout - Stacked */}
          <div className="lg:hidden flex flex-col items-center justify-center h-full px-4 sm:px-6">
            {/* Sun Poem - Top */}
            <div className="w-full max-w-sm sm:max-w-md mb-8">
              <div className="mb-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-serif text-yellow-300 mb-4 drop-shadow-lg sun-glow">Sol</h2>
              </div>
              <div className="space-y-2 text-center">
                {sunPoem.map((line, index) => (
                  <div
                    key={index}
                    className={`text-sm sm:text-base leading-relaxed text-yellow-100 font-serif transition-all duration-1000 typewriter-mobile sun-text-glow ${
                      index <= currentSunLine ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Moon Poem - Bottom */}
            <div className="w-full max-w-sm sm:max-w-md">
              <div className="mb-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-serif text-blue-300 mb-4 drop-shadow-lg moon-glow">Lua</h2>
              </div>
              <div className="space-y-2 text-center">
                {moonPoem.map((line, index) => (
                  <div
                    key={index}
                    className={`text-sm sm:text-base leading-relaxed text-blue-100 font-serif transition-all duration-1000 typewriter-mobile moon-text-glow ${
                      index <= currentMoonLine ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
        .magical-garden {
          animation: gardenAppear 5s ease-out forwards;
        }

        @keyframes gardenAppear {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes starPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        @keyframes starRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes coronaRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes instabilityPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        @keyframes explosionCore {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          30% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(8);
            opacity: 0;
          }
        }

        @keyframes explosionWave {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(15);
            opacity: 0;
          }
        }

        @keyframes cosmicShockwave {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
          }
        }

        @keyframes subtleTwinkle {
          0%, 100% { 
            opacity: 0.3; 
          }
          50% { 
            opacity: 0.8; 
          }
        }

        /* Flower Garden Styles */
        .flowers {
          position: relative;
          transform: scale(0.9);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          min-height: 100vh;
          perspective: 1000px;
        }

        .flower {
          position: absolute;
          bottom: 10vmin;
          transform-origin: bottom center;
          z-index: 10;
        }

        .flower--1 {
          animation: moving-flower-1 4s linear infinite;
        }

        .flower--2 {
          left: 50%;
          transform: rotate(20deg);
          animation: moving-flower-2 4s linear infinite;
        }

        .flower--3 {
          left: 50%;
          transform: rotate(-15deg);
          animation: moving-flower-3 4s linear infinite;
        }

        .flower__leafs {
          position: relative;
          animation: blooming-flower 2s 0.8s backwards;
        }

        .flower__leafs--2 {
          animation-delay: 1.1s;
        }

        .flower__leafs--3 {
          animation-delay: 1.4s;
        }

        .flower__leafs::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          transform: translate(-50%, -100%);
          width: 8vmin;
          height: 8vmin;
          background-color: #6bf0ff;
          filter: blur(10vmin);
        }

        .flower__leaf {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 8vmin;
          height: 11vmin;
          border-radius: 51% 49% 47% 53% / 44% 45% 55% 69%;
          background-color: #ff6b6b;
          background-image: linear-gradient(to top, #dc2626, #ff6b6b);
          transform-origin: bottom center;
          opacity: 0.9;
          box-shadow: inset 0 0 2vmin rgba(255, 255, 255, 0.5);
        }

        .flower__leaf--1 {
          transform: translate(-10%, 1%) rotateY(40deg) rotateX(-50deg);
        }

        .flower__leaf--2 {
          transform: translate(-50%, -4%) rotateX(40deg);
        }

        .flower__leaf--3 {
          transform: translate(-90%, 0%) rotateY(45deg) rotateX(50deg);
        }

        .flower__leaf--4 {
          width: 8vmin;
          height: 8vmin;
          transform-origin: bottom left;
          border-radius: 4vmin 10vmin 4vmin 4vmin;
          transform: translate(-0%, 18%) rotateX(70deg) rotate(-43deg);
          background-image: linear-gradient(to top, #ef4444, #ff6b6b);
          z-index: 1;
          opacity: 0.8;
        }

        .flower__white-circle {
          position: absolute;
          left: -3.5vmin;
          top: -3vmin;
          width: 9vmin;
          height: 4vmin;
          border-radius: 50%;
          background-color: #fff;
        }

        .flower__white-circle::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 45%;
          transform: translate(-50%, -50%);
          width: 60%;
          height: 60%;
          border-radius: inherit;
          background-image: linear-gradient(90deg, rgb(255, 235, 18), rgb(255, 206, 0));
        }

        .flower__line {
          height: 55vmin;
          width: 1.5vmin;
          background-image: linear-gradient(
              to left,
              rgb(0, 0, 0, 0.2),
              transparent,
              rgba(255, 255, 255, 0.2)
            ),
            linear-gradient(to top, transparent 10%, #99fa00, #99fa00);
          box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);
          animation: grow-flower-tree 4s 0.3s backwards;
        }

        .flower--2 .flower__line {
          height: 60vmin;
          animation-delay: 0.6s;
        }

        .flower--3 .flower__line {
          animation-delay: 0.9s;
        }

        .flower__line__leaf {
          --w: 7vmin;
          --h: calc(var(--w) + 2vmin);
          position: absolute;
          top: 20%;
          left: 90%;
          width: var(--w);
          height: var(--h);
          border-top-right-radius: var(--h);
          border-bottom-left-radius: var(--h);
          background-image: linear-gradient(
            to top,
            rgba(147, 225, 25, 0.4),
            #93e119
          );
        }

        .flower__line__leaf--1 {
          transform: rotate(70deg) rotateY(30deg);
          animation: blooming-leaf-right 0.8s 1.6s backwards;
        }

        .flower__line__leaf--2 {
          top: 45%;
          transform: rotate(70deg) rotateY(30deg);
          animation: blooming-leaf-right 0.8s 1.4s backwards;
        }

        .flower__line__leaf--3,
        .flower__line__leaf--4,
        .flower__line__leaf--6 {
          border-top-right-radius: 0;
          border-bottom-left-radius: 0;
          border-top-left-radius: var(--h);
          border-bottom-right-radius: var(--h);
          left: -460%;
          top: 12%;
          transform: rotate(-70deg) rotateY(30deg);
        }

        .flower__line__leaf--3 {
          animation: blooming-leaf-left 0.8s 1.2s backwards;
        }

        .flower__line__leaf--4 {
          top: 40%;
          animation: blooming-leaf-left 0.8s 1s backwards;
        }

        .flower__line__leaf--5 {
          top: 0;
          transform-origin: left;
          transform: rotate(70deg) rotateY(30deg) scale(0.6);
          animation: blooming-leaf-right 0.8s 1.8s backwards;
        }

        .flower__line__leaf--6 {
          top: -2%;
          left: -450%;
          transform-origin: right;
          transform: rotate(-70deg) rotateY(30deg) scale(0.6);
          animation: blooming-leaf-left 0.8s 2s backwards;
        }

        .flower__light {
          position: absolute;
          bottom: 0vmin;
          width: 1vmin;
          height: 1vmin;
          background-color: rgb(255, 251, 0);
          border-radius: 50%;
          filter: blur(0.2vmin);
          animation: light-ans 4s linear infinite backwards;
        }

        .flower__light:nth-child(odd) {
          background-color: #fcf13a;
        }

        .flower__light--1 {
          left: -2vmin;
          animation-delay: 1s;
        }

        .flower__light--2 {
          left: 3vmin;
          animation-delay: 0.5s;
        }

        .flower__light--3 {
          left: -6vmin;
          animation-delay: 0.3s;
        }

        .flower__light--4 {
          left: 6vmin;
          animation-delay: 0.9s;
        }

        .flower__light--5 {
          left: -1vmin;
          animation-delay: 1.5s;
        }

        .flower__light--6 {
          left: -4vmin;
          animation-delay: 3s;
        }

        .flower__light--7 {
          left: 3vmin;
          animation-delay: 2s;
        }

        .flower__light--8 {
          left: -6vmin;
          animation-delay: 3.5s;
        }

        @keyframes light-ans {
          0% {
            opacity: 0;
            transform: translateY(0vmin);
          }
          25% {
            opacity: 1;
            transform: translateY(-5vmin) translateX(-2vmin);
          }
          50% {
            opacity: 1;
            transform: translateY(-15vmin) translateX(2vmin);
            filter: blur(0.2vmin);
          }
          75% {
            transform: translateY(-20vmin) translateX(-2vmin);
            filter: blur(0.2vmin);
          }
          100% {
            transform: translateY(-30vmin);
            opacity: 0;
            filter: blur(1vmin);
          }
        }

        @keyframes moving-flower-1 {
          0%, 100% {
            transform: rotate(2deg);
          }
          50% {
            transform: rotate(-2deg);
          }
        }

        @keyframes moving-flower-2 {
          0%, 100% {
            transform: rotate(18deg);
          }
          50% {
            transform: rotate(14deg);
          }
        }

        @keyframes moving-flower-3 {
          0%, 100% {
            transform: rotate(-18deg);
          }
          50% {
            transform: rotate(-20deg) rotateY(-10deg);
          }
        }

        @keyframes blooming-leaf-right {
          0% {
            transform-origin: left;
            transform: rotate(70deg) rotateY(30deg) scale(0);
          }
        }

        @keyframes blooming-leaf-left {
          0% {
            transform-origin: right;
            transform: rotate(-70deg) rotateY(30deg) scale(0);
          }
        }

        @keyframes grow-flower-tree {
          0% {
            height: 0;
            border-radius: 1vmin;
          }
        }

        @keyframes blooming-flower {
          0% {
            transform: scale(0);
          }
        }

        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        .typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(40, end);
        }

        .typewriter-mobile {
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 1.5s steps(30, end);
        }

        /* Glowing Effects */
        .sun-glow {
          text-shadow: 
            0 0 10px rgba(255, 215, 0, 0.8),
            0 0 20px rgba(255, 215, 0, 0.6),
            0 0 30px rgba(255, 215, 0, 0.4),
            0 0 40px rgba(255, 215, 0, 0.2);
          animation: sunGlow 3s ease-in-out infinite alternate;
        }

        .sun-text-glow {
          text-shadow: 
            0 0 5px rgba(255, 215, 0, 0.6),
            0 0 10px rgba(255, 215, 0, 0.4),
            0 0 15px rgba(255, 215, 0, 0.2);
        }

        .moon-glow {
          text-shadow: 
            0 0 10px rgba(173, 216, 230, 0.8),
            0 0 20px rgba(173, 216, 230, 0.6),
            0 0 30px rgba(173, 216, 230, 0.4),
            0 0 40px rgba(173, 216, 230, 0.2);
          animation: moonGlow 3s ease-in-out infinite alternate;
        }

        .moon-text-glow {
          text-shadow: 
            0 0 5px rgba(173, 216, 230, 0.6),
            0 0 10px rgba(173, 216, 230, 0.4),
            0 0 15px rgba(173, 216, 230, 0.2);
        }

        @keyframes sunGlow {
          0% {
            text-shadow: 
              0 0 10px rgba(255, 215, 0, 0.8),
              0 0 20px rgba(255, 215, 0, 0.6),
              0 0 30px rgba(255, 215, 0, 0.4),
              0 0 40px rgba(255, 215, 0, 0.2);
          }
          100% {
            text-shadow: 
              0 0 15px rgba(255, 215, 0, 1),
              0 0 25px rgba(255, 215, 0, 0.8),
              0 0 35px rgba(255, 215, 0, 0.6),
              0 0 45px rgba(255, 215, 0, 0.4);
          }
        }

        @keyframes moonGlow {
          0% {
            text-shadow: 
              0 0 10px rgba(173, 216, 230, 0.8),
              0 0 20px rgba(173, 216, 230, 0.6),
              0 0 30px rgba(173, 216, 230, 0.4),
              0 0 40px rgba(173, 216, 230, 0.2);
          }
          100% {
            text-shadow: 
              0 0 15px rgba(173, 216, 230, 1),
              0 0 25px rgba(173, 216, 230, 0.8),
              0 0 35px rgba(173, 216, 230, 0.6),
              0 0 45px rgba(173, 216, 230, 0.4);
          }
        }
        `}
      </style>
    </div>
  )
}
