import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// VITE_TARGET=artifact produces a single self-contained page for publishing:
// idea review and sketch reading go through the page's own Claude capability
// instead of our proxy, and scripts/build-artifact.mjs inlines everything.
const isArtifact = process.env.VITE_TARGET === 'artifact'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: isArtifact ? 'dist-artifact' : 'dist',
    cssCodeSplit: false,
    // Everything must end up in one file, so no separate chunks or assets.
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    rollupOptions: isArtifact ? { output: { inlineDynamicImports: true } } : {},
  },
  server: {
    host: true,
    port: 5173,
    // The browser never holds an API key — everything AI goes through the proxy.
    proxy: { '/api': { target: process.env.API_ORIGIN || 'http://localhost:8787', changeOrigin: true } },
  },
})
