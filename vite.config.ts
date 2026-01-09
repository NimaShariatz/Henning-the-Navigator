import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//  base: '/Henning-the-Navigator/',
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist'
  }
})


//do "npm run deploy" to redeploy