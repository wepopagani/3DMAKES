// Configurazione Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC6i0YOfn2YrasjYm13YrQmUr3c2RLtv0M",
    authDomain: "dmakes-a2c74.firebaseapp.com",
    projectId: "dmakes-a2c74",
    storageBucket: "dmakes-a2c74.firebasestorage.app",
    messagingSenderId: "148613353871",
    appId: "1:148613353871:web:a6d2344662873abcfabbfa",
};

// Abilita il debug Firebase in sviluppo
if (window.location.hostname === 'localhost') {
  window.localStorage.setItem('firebase:debug', '*');
  console.log("Firebase debug mode attivato");
}

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza servizi Firebase con configurazioni ottimizzate
export const auth = getAuth(app);

// Inizializza Firestore con cache
// Utilizziamo il nuovo approccio consigliato invece di enableIndexedDbPersistence
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // Migliore compatibilità nei browser
});

export const storage = getStorage(app);

// Avviso sulla modalità produzione
console.log("🔥 Firebase in modalità produzione: connesso al progetto dmakes-a2c74");

export default app; 