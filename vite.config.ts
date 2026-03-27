import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createRequire } from "module";

// In questo progetto `package.json` ha `type: module`, quindi un `import` standard
// caricherebbe la build ESM del plugin che internamente usa `require` e va in errore.
// Forziamo invece il caricamento della variante CommonJS.
const require = createRequire(import.meta.url);
const vitePrerender = require("vite-plugin-prerender");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
    mode === "production" &&
      vitePrerender({
        staticDir: path.join(__dirname, "dist"),
        indexPath: path.join(__dirname, "dist", "index.html"),
        routes:
          process.env.PRERENDER_ROUTES
            ? process.env.PRERENDER_ROUTES.split(",").map((s) => s.trim()).filter(Boolean)
            : [
                "/",
                "/about",
                "/mission",
                "/services",
                "/calculator",
                "/blog",
                "/contact-success",
                "/services/fdm",
                "/services/cff",
                "/services/sla",
                "/services/slm",
                "/services/sls",
                "/services/mjf",
                "/services/polyjet",
                "/services/laser",
                "/services/riparazione-stampanti",
                "/services/scansione",
                "/services/prototipazione",
                "/services/lsam",
                "/blog/stampa-3d-odontotecnica",
                "/blog/ciotole-personalizzabili",
                "/blog/cuscinetti-tpu-ferrature-equine",
                "/blog/gadget-aziendali-nfc",
                "/blog/accessori-ristorativi",
                "/blog/componenti-meccanici",
                "/blog/protesi-mediche",
                "/blog/come-funziona-stampa-3d",
                "/blog/materiali-stampa-3d",
                "/blog/prototipazione-rapida",
                "/blog/applicazioni-creative-stampa-3d",
                "/blog/stampanti-3d-confronto",
              ],
        renderer: new (vitePrerender as any).PuppeteerRenderer({
          headless: true,
          // Non blocchiamo terze parti: durante il prerender vogliamo massima probabilità
          // che l'app completi il mount e popoli il contenuto.
          skipThirdPartyRequests: false,
          // Dopo il fix target es2019 il bundle gira subito; un breve delay copre async (i18n, auth).
          renderAfterTime: 5000,
        }),
        // Assicuriamoci che l'output rimanga sotto dist/.
        outputDir: path.join(__dirname, "dist"),
      }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    // Prerender (@prerenderer/renderer-puppeteer → puppeteer 1.x → Chromium ~78) non supporta
    // sintassi ES2020+ (es. optional chaining) nel bundle. Allineiamo l'output a ES2019.
    target: "es2019",
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
        }
      }
    }
  }
}));
