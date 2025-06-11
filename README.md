# Falar com IA 🎤🤖

Um site para conversar por voz com inteligência artificial usando Google Gemini.

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- Navegador moderno com suporte a microfone

### Passos para Configuração

1. **Baixe o projeto** usando o botão "Download Code"

2. **Navegue até a pasta do projeto**
   \`\`\`bash
   cd falar-com-ia
   \`\`\`

3. **Execute o script de configuração**
   \`\`\`bash
   npm run setup
   \`\`\`

4. **Inicie o servidor de desenvolvimento**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Abra no navegador**
   - Acesse: http://localhost:3000
   - **Importante**: Use HTTPS em produção para acesso ao microfone

## 🔧 Configuração Manual

Se o script automático não funcionar:

1. **Instale as dependências**
   \`\`\`bash
   npm install
   \`\`\`

2. **Crie o arquivo .env.local**
   \`\`\`bash
   echo "GEMINI_API_KEY=AIzaSyBPz7dtKChfbQnhsthPvFUyI-38DNe065E" > .env.local
   \`\`\`

3. **Execute o projeto**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🌐 Deploy em Produção

### Vercel (Recomendado)
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Faça upload dos arquivos ou conecte ao GitHub
4. Configure a variável `GEMINI_API_KEY` nas configurações
5. Deploy automático!

### Netlify
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto para o deploy
3. Configure a variável de ambiente
4. Ative HTTPS para funcionalidade completa

## 📱 Como Usar

1. **Permita acesso ao microfone** quando solicitado
2. **Clique em "Iniciar"** para começar a gravar
3. **Fale naturalmente** - a IA processará automaticamente
4. **Ouça as respostas** da IA em áudio e texto
5. **Continue a conversa** ou pare quando quiser

## 🔒 Segurança

- A API key está configurada apenas para este projeto
- O áudio é processado em tempo real, não armazenado
- Use HTTPS em produção para segurança completa

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **Google Gemini** - IA para processamento de voz
- **Web Audio API** - Captura e processamento de áudio
- **Web Speech API** - Text-to-speech
- **Tailwind CSS** - Estilização
- **TypeScript** - Tipagem estática

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o microfone está funcionando
2. Certifique-se de que está usando HTTPS em produção
3. Verifique o console do navegador para erros
4. Teste em um navegador diferente

---

**Desenvolvido com ❤️ usando Google Gemini AI**
