import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    headers: {
      'Content-Security-Policy': `
        default-src 'self' https://*.spline.design https://*.google.com https://*.googleapis.com;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.google.com https://*.gstatic.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: blob: https://*.google.com https://*.googleapis.com https://*.gstatic.com https://clients1.google.com;
        font-src 'self' data: https://fonts.gstatic.com;
        connect-src 'self' https://*.spline.design https://prod.spline.design https://*.google.com https://*.googleapis.com ws://localhost:* http://localhost:*;
        frame-src 'self' https://*.google.com https://*.spline.design;
        worker-src 'self' blob: 'unsafe-inline';
        media-src 'self' blob: data:;
      `.replace(/\s+/g, ' ').trim(),
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
  },
  define: {
    'process.env': process.env,
  },
});