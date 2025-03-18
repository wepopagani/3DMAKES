import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Rimuovi l'intestazione CSP qui
    },
    allowedHosts: [
      'localhost',
      '4ca2-89-217-100-200.ngrok-free.app',
      '*.ngrok-free.app'
    ]
  },
  define: {
    'process.env': process.env,
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs'],
      strictRequires: true,
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Creiamo chunk separati per le librerie principali
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('three')) {
              return 'vendor-three';
            }
            // Altri vendor chunks se necessario
            return 'vendor'; // Default vendor chunk
          }
        }
      },
      chunkSizeWarningLimit: 1000, // Aumenta il limite per i warning (opzionale)
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Necessario per risolvere problemi di compatibilità con Node.js builtins
      define: {
        global: 'globalThis'
      }
    }
  }
});