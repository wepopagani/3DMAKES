import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react({
    babel: {
      babelrc: false,
      configFile: false,
      plugins: []
    }
  })],
  server: {
    port: 3000,
    strictPort: false,
    cors: true,
    host: '0.0.0.0',
    open: true,
    hmr: {
      host: 'localhost',
      port: 3002
    },
    // Temporarily disabling proxy for testing
    /* proxy: {
      '/api': {
        target: 'https://short.3dmakes.ch',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Origin', 'https://short.3dmakes.ch');
            proxyReq.setHeader('Host', 'short.3dmakes.ch');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Accept';
          });
        }
      }
    } */
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});