"use client"

export function RateLimitInfo() {
  return (
    <div className="w-full max-w-md bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
      <div className="text-center">
        <h3 className="text-yellow-400 text-sm font-medium mb-2">Limite de Uso</h3>
        <p className="text-yellow-200/80 text-xs leading-relaxed">
          Para evitar sobrecarga, há um limite de requisições por minuto. Se atingir o limite, aguarde alguns segundos
          antes de continuar.
        </p>
      </div>
    </div>
  )
}
