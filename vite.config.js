import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        certifications: resolve(__dirname, 'certifications.html'),
        hackathons: resolve(__dirname, 'hackathons.html'),
        internship: resolve(__dirname, 'internship.html'),
        leadership: resolve(__dirname, 'leadership.html'),
        simulations: resolve(__dirname, 'simulations.html'),
      }
    }
  }
})
