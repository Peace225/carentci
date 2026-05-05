import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Indispensable pour tes appels API (Login, CRUD véhicules, etc.)
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Indispensable pour charger les images sauvegardées dans backend/uploads
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
      // NOTE : On a supprimé '/admin' d'ici pour que React Router puisse
      // afficher ton Dashboard sans interférence du serveur Node.js.
    },
  },
})