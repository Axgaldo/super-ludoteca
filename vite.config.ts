import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// La app se aloja en GitHub Pages bajo /super-ludoteca/
const BASE_URL = '/super-ludoteca/'

export default defineConfig({
  base: BASE_URL,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'favicon.png', 'apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Super Ludoteca',
        short_name: 'Ludoteca',
        description:
          'Compañero de mesa para tu colección de juegos de mesa: organiza tu ludoteca, filtra por jugadores o duración y refresca las reglas en 3 minutos.',
        lang: 'es',
        display: 'standalone',
        orientation: 'any',
        scope: './',
        start_url: './',
        theme_color: '#09090b',
        background_color: '#09090b',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  build: {
    sourcemap: false,
    target: 'es2022',
  },
})
