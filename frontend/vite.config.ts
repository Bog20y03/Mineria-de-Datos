import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * El backend PHP existente vive en Apache (XAMPP) bajo esta ruta.
 * En desarrollo, todo lo que empiece por `/md` se reenvía a Apache, de modo que
 * React consume `api/index.php` y los recursos (PNG de resultados) sin CORS ni
 * cambios en el PHP.
 */
const BACKEND_TARGET = process.env.VITE_BACKEND_TARGET || 'http://localhost:8000'
const BACKEND_PATH = process.env.VITE_BACKEND_PATH !== undefined ? process.env.VITE_BACKEND_PATH : ''

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/md': {
        target: BACKEND_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/md/, BACKEND_PATH),
      },
    },
  },
})
