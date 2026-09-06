import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // The browser never holds an API key — everything AI goes through the proxy.
    proxy: { '/api': { target: process.env.API_ORIGIN || 'http://localhost:8787', changeOrigin: true } },
  },
})
