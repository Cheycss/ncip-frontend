import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Allow external connections
    open: true
  },
  build: {
    outDir: 'dist'
  },
  preview: {
    port: 4173,
    host: true // Allow external connections for preview mode
  }
})
