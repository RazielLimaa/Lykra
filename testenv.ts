import { config } from "dotenv";
config();

console.log("MURF_TTS_API_KEY:", process.env.MURF_TTS_API_KEY);
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Total de variáveis de ambiente:", Object.keys(process.env).length);