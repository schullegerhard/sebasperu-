/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Evita que Next infiera mal la raíz del workspace (varios lockfiles).
  outputFileTracingRoot: import.meta.dirname,
  // Permite servir detrás de túneles (ngrok) en desarrollo.
  experimental: { },
}
export default nextConfig
