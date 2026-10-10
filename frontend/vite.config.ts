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

  const checkUrl = (url: string) =>
    new Promise<boolean>((resolve) => {
      const req = http.get(url, { timeout: 1500 }, (res) => {
        resolve(res.statusCode === 200)
      })
      req.on('error', () => resolve(false))
      req.on('timeout', () => {
        req.destroy()
        resolve(false)
      })
    })

  // 1. Probar servidor PHP CLI (127.0.0.1:8000, localhost:8000 o [::1]:8000)
  const is127 = await checkUrl('http://127.0.0.1:8000/api/index.php?action=progress')
  if (is127) {
    return { target: 'http://127.0.0.1:8000', prefix: '' }
  }

  const isLocalhost = await checkUrl('http://localhost:8000/api/index.php?action=progress')
  if (isLocalhost) {
    return { target: 'http://localhost:8000', prefix: '' }
  }

  const isIpv6 = await checkUrl('http://[::1]:8000/api/index.php?action=progress')
  if (isIpv6) {
    return { target: 'http://[::1]:8000', prefix: '' }
  }

  // 2. Probar si Apache (puerto 80) realmente responde 200 en la carpeta
  const folderName = path.basename(path.resolve(__dirname, '..'))
  const apachePrefix = `/${encodeURIComponent(folderName)}`
  const isApache = await checkUrl(`http://localhost${apachePrefix}/api/index.php?action=progress`)
  if (isApache) {
    return { target: 'http://localhost', prefix: apachePrefix }
  }

  // 3. Fallback seguro por defecto: servidor PHP CLI en 127.0.0.1:8000
  return {
    target: 'http://127.0.0.1:8000',
    prefix: '',
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
