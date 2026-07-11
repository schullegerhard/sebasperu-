import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    // En desarrollo, /api se redirige a la API Express (mismo origen relativo).
    proxy: { '/api': 'http://localhost:4000' }
  },
  preview: {
    port: 4173,
    host: true,
    // Permite servir a través de túneles (ngrok, etc.).
    allowedHosts: true
  }
})
