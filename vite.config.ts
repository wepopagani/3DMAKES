import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Add Cross-Origin Embedder Policy header
      'Cross-Origin-Embedder-Policy': 'require-corp',
      // Add Cross-Origin Opener Policy header
      'Cross-Origin-Opener-Policy': 'same-origin',
      // Add Cross-Origin Resource Policy header
      'Cross-Origin-Resource-Policy': 'cross-origin'
    }
  }
})