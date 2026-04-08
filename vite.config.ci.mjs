import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// CI uses Vite's native config loader to avoid rolldown optional native binding issues.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  build: {
    sourcemap: true,
    emptyOutDir: false
  }
})
