import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// VITE_TARGET=artifact produces a single self-contained page for publishing:
// no server of ours to call, so the 3D viewer is stubbed out and everything
// is inlined by scripts/build-artifact.mjs.
const isArtifact = process.env.VITE_TARGET === 'artifact'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: isArtifact
      ? { '@google/model-viewer': fileURLToPath(new URL('./src/lib/model-viewer-stub.js', import.meta.url)) }
      : {},
  },
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
