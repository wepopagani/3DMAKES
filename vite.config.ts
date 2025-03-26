import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    headers: {
      // Rimuovi l'intestazione CSP qui
    },
    allowedHosts: [
      'localhost',
      'd29e-89-217-100-200.ngrok-free.app',
      '*.ngrok-free.app'
    ],
    proxy: {
      '/upload': {
        target: 'https://server.3dmakes.ch',
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: {
    'process.env': process.env,
  },
  assetsInclude: ['**/*.pdf'],
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.pdf')) {
            return 'documents/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
});