import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import http from 'node:http'
import path from 'node:path'

/**
 * Detecta automáticamente si el backend PHP está corriendo en el servidor CLI (localhost:8000)
 * o directamente en Apache de XAMPP (puerto 80) bajo la carpeta del proyecto en htdocs.
 */
async function resolveBackendConfig() {
  if (process.env.VITE_BACKEND_TARGET) {
    return {
      target: process.env.VITE_BACKEND_TARGET,
      prefix: process.env.VITE_BACKEND_PATH !== undefined ? process.env.VITE_BACKEND_PATH : '',
    }
  }

  // 1. Probar si el servidor interno PHP (localhost:8000) está respondiendo
  const hasPhpCli = await new Promise<boolean>((resolve) => {
    const req = http.get('http://127.0.0.1:8000/api/index.php?action=progress', { timeout: 300 }, (res) => {
      resolve(res.statusCode === 200)
    })
    req.on('error', () => resolve(false))
    req.on('timeout', () => {
      req.destroy()
      resolve(false)
    })
  })

  if (hasPhpCli) {
    return {
      target: 'http://localhost:8000',
      prefix: '',
    }
  }

  // 2. Por defecto en XAMPP, el backend se sirve desde Apache (puerto 80) en htdocs/<carpeta>
  const folderName = path.basename(path.resolve(__dirname, '..'))
  const apachePrefix = `/${encodeURIComponent(folderName)}`

  return {
    target: 'http://localhost',
    prefix: apachePrefix,
  }
}

// https://vite.dev/config/
export default defineConfig(async () => {
  const backend = await resolveBackendConfig()

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/md': {
          target: backend.target,
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/md/, backend.prefix),
        },
      },
    },
  }
})

