import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Navigator/', 
  build: {
    outDir: 'dist'
  }
})


//do "npm run deploy" to redeploy