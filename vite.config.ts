import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.spline.design https://prod.spline.design; connect-src 'self' https://*.spline.design https://prod.spline.design ws://localhost:* http://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.spline.design; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.spline.design; frame-src 'self' https://*.spline.design;"
    }
  },
  define: {
    'process.env': process.env,
  },
});