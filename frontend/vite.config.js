import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api':{
        target:"http://localhost:5000",
      }
    }
  },
  define: {
    'process.env': {}, // Avoid errors for `process`
  },
  build: {
    rollupOptions: {
      external: ['ioredis'], // Exclude ioredis from bundling
    },
  },
  

})
 