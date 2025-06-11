#!/bin/bash

echo "🚀 Configurando projeto Falar com IA localmente..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar arquivo .env.local se não existir
if [ ! -f .env.local ]; then
    echo "🔑 Criando arquivo de variáveis de ambiente..."
    echo "GEMINI_API_KEY=AIzaSyBPz7dtKChfbQnhsthPvFUyI-38DNe065E" > .env.local
    echo "✅ Arquivo .env.local criado"
else
    echo "✅ Arquivo .env.local já existe"
fi

echo "🎯 Configuração concluída!"
echo "Execute 'npm run dev' para iniciar o servidor de desenvolvimento"
