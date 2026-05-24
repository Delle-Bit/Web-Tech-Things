import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        facilities: resolve(__dirname, 'facilities.html'),
        instructors: resolve(__dirname, 'instructors.html'),
        about: resolve(__dirname, 'about.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
