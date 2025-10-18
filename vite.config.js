import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// إعداد Vite لتوافق Netlify
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
