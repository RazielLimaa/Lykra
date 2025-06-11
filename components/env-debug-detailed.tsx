"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle } from "lucide-react"

export function EnvDebugDetailed() {
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkEnvVars = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/tts")
      const data = await response.json()
      setEnvStatus(data)
    } catch (error) {
      console.error("Erro ao verificar env vars:", error)
      setEnvStatus({ error: "Erro na requisição" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkEnvVars()
  }, [])

  return (
    <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Debug Detalhado - Variáveis de Ambiente</span>
          <Button
            onClick={checkEnvVars}
            disabled={loading}
            variant="ghost"
            size="sm"
            className="text-cyan-400 hover:text-cyan-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {envStatus ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {envStatus.hasApiKey ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className="text-white">API Key encontrada: {envStatus.hasApiKey ? "Sim" : "Não"}</span>
            </div>

            <div className="bg-gray-800/50 p-3 rounded-lg font-mono text-sm">
              <div className="text-gray-300">
                <div>Comprimento da API Key: {envStatus.apiKeyLength || 0}</div>
                <div>Preview: {envStatus.apiKeyPreview || "N/A"}</div>
                <div>NODE_ENV: {envStatus.nodeEnv || "N/A"}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-medium">Variáveis encontradas:</h4>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                {envStatus.allMurfEnvVars && envStatus.allMurfEnvVars.length > 0 ? (
                  <ul className="text-green-400 font-mono text-sm">
                    {envStatus.allMurfEnvVars.map((envVar: string, index: number) => (
                      <li key={index}>✓ {envVar}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-red-400 text-sm">❌ Nenhuma variável MURF_* encontrada</p>
                )}
              </div>
            </div>

            {envStatus.error && (
              <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">Erro: {envStatus.error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-gray-400">Verificando variáveis de ambiente...</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-400/10 border border-blue-400/20 rounded-lg">
          <h4 className="text-blue-400 font-medium mb-2">Checklist de Solução:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>✓ Arquivo .env.local na raiz do projeto</li>
            <li>✓ Variável: MURF_TTS_API_KEY (não MURF_API_KEY)</li>
            <li>✓ Reiniciar servidor após alterar .env.local</li>
            <li>✓ Sem espaços extras no arquivo .env.local</li>
            <li>✓ Verificar se não há .env conflitante</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
