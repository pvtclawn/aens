import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/aens/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
