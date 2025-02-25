import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.google.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: blob: https://*.google.com https://*.googleapis.com https://*.gstatic.com https://clients1.google.com;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' https://*.google.com https://*.googleapis.com https://prod.spline.design https://spline.design;
        frame-src 'self' https://*.google.com;
        worker-src 'self' blob:;
      `.replace(/\s+/g, ' ').trim(),
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
  },
  define: {
    'process.env': process.env,
  },
});