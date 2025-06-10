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
