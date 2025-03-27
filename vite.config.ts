import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/upload': {
        target: 'https://3c83-89-217-100-200.ngrok-free.app',
        changeOrigin: true,
        secure: false,
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    allowedHosts: [
      'localhost',
      '192.168.1.182',
      'd29e-89-217-100-200.ngrok-free.app',
      '*.ngrok-free.app'
    ]
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