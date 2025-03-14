import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
      '1819-89-217-100-200.ngrok-free.app',
      '*.ngrok-free.app'
    ]
  },
  define: {
    'process.env': process.env,
  },
});