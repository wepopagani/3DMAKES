/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_OPENAI_API_KEY: string;
    // Puoi aggiungere altre variabili d'ambiente qui se necessario
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }