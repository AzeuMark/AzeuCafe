import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
    // Cloudflare quick tunnels send a random *.trycloudflare.com Host header;
    // scoped suffix allow so the demo tunnel can serve the dev app.
    allowedHosts: ['.trycloudflare.com'],
  },
})
