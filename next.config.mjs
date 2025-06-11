/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    MURF_TTS_API_KEY: process.env.MURF_TTS_API_KEY,
  },
}


export default nextConfig
