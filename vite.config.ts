import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Dev-server only: where to forward `/graphql` (Docker service name or localhost). */
const apiProxyTarget = process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:3001'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/graphql': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
})
