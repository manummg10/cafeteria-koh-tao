import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo, /api se redirige al backend: mismo origen => cookie SameSite=Strict sin CORS
    proxy: {
      '/api': { target: 'http://localhost:5041', changeOrigin: false },
    },
  },
})
