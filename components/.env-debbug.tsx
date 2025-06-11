"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { RefreshCw, Eye, EyeOff } from "lucide-react"

export function EnvDebug() {
  const [apiStatus, setApiStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const checkApiStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/tts")
      const data = await response.json()
      setApiStatus(data)
      console.log("API Status:", data)
    } catch (error) {
      console.error("Erro ao verificar API:", error)
      setApiStatus({ error: "Erro ao verificar API" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkApiStatus()
  }, [])

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-cyan-400 font-medium">Debug API Status</h3>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            onClick={checkApiStatus}
            disabled={loading}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {apiStatus && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.hasApiKey ? "bg-green-400" : "bg-red-400"}`} />
            <span className="text-white/80 text-sm">
              API Key: {apiStatus.hasApiKey ? "✅ Configurada" : "❌ Não encontrada"}
            </span>
          </div>

          {showDetails && (
            <div className="bg-black/20 rounded p-3 text-xs font-mono space-y-1">
              <div className="text-cyan-400">Detalhes da API:</div>
              <div className="text-white/70">Length: {apiStatus.apiKeyLength}</div>
              <div className="text-white/70">Preview: {apiStatus.apiKeyPreview}</div>
              <div className="text-white/70">Node ENV: {apiStatus.nodeEnv}</div>
              <div className="text-white/70">Google Env Vars: {JSON.stringify(apiStatus.allGoogleEnvVars)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
