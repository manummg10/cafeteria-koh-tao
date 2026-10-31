import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import seoPlugin from './seo/vitePluginSeo.js'

// https://vite.dev/config/
// Dos páginas: la portada y la oferta de empleo (HTML propio para que al compartir el enlace se vea su vista previa)
export default defineConfig({
  plugins: [react(), seoPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        empleo: resolve(import.meta.dirname, 'trabaja-con-nosotros/index.html'),
      },
    },
  },
})
