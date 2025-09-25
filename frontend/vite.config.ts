import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = env.VITE_API_BASE_URL
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiBase.replace(/\/$/, ''),
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
