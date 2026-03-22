import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'index.html'),
        writeRecords: resolve(__dirname, 'write-records/index.html'),
      },
    },
  },
})
