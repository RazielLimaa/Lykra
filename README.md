<<<<<<< HEAD
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
=======
# Lykra - Interface Neural de Comunicação

Uma interface de voz minimalista e elegante para conversas com IA, desenvolvida com foco na experiência do usuário e design clean.

## Sobre o Projeto

Criei o Lykra como uma forma de explorar as possibilidades de comunicação natural com inteligência artificial. A ideia era desenvolver algo que fosse visualmente atraente, mas sem exageros - um design que respirasse e colocasse o foco na conversa em si.

O nome "Lykra" veio da busca por algo que soasse tecnológico, mas ao mesmo tempo orgânico. Queria que a interface transmitisse a sensação de estar conversando com algo inteligente, mas de forma natural e intuitiva.

## Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Escolhi o Next.js pela facilidade de trabalhar com Server Actions e pela performance
- **React 18** - Para a reatividade da interface e gerenciamento de estado
- **TypeScript** - Porque não consigo mais viver sem tipagem estática
- **Tailwind CSS** - Para estilização rápida e consistente
- **Lucide React** - Ícones minimalistas que combinam com o design

### APIs e Integrações
- **Google Gemini AI** - Para processamento de linguagem natural e conversação
- **Murf.ai TTS** - Para síntese de voz com qualidade profissional
- **Web Audio API** - Para captura e análise de áudio em tempo real
- **MediaRecorder API** - Para gravação de áudio no navegador

## Como Funciona

### Sistema de Gravação de Áudio

Implementei um sistema que captura áudio em chunks de 8 segundos (configurável). A escolha dos 8 segundos foi estratégica - tempo suficiente para uma frase completa, mas não tanto que cause delay na resposta.

```typescript
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: "audio/webm;codecs=opus",
})
>>>>>>> 94e668c65fd5a707d6a6bd5fbea6307f1eff4508
