import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __PORTONE_IMP_CODE__: JSON.stringify(env.PORTONE_IMP_CODE ?? ''),
      __PORTONE_CHANNEL_KEY__: JSON.stringify(env.PORTONE_CHANNEL_KEY ?? ''),
      __PORTONE_PG__: JSON.stringify(env.PORTONE_PG ?? ''),
    },
    server: {
      proxy: {
        '/api': 'http://localhost:8080',
      },
    },
    build: {
      sourcemap: true,
      emptyOutDir: false,
    },
  }
})
