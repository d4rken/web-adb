import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/web-adb/',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.APP_VERSION || 'dev'),
  },
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**'],
    },
  },
})
