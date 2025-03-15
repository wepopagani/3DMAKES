import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, getDoc, deleteDoc, doc, Timestamp 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app, { auth, db, storage } from '../firebase/config';

type Status = 'not_tested' | 'testing' | 'success' | 'error';

const FirebaseTestPage: React.FC = () => {
  // Stati per la connessione Firebase
  const [firebaseStatus, setFirebaseStatus] = useState<Status>('not_tested');
  
  // Stati per l'autenticazione
  const [authStatus, setAuthStatus] = useState<Status>('not_tested');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authMessage, setAuthMessage] = useState<string>('');
  
  // Stati per Firestore
  const [firestoreStatus, setFirestoreStatus] = useState<Status>('not_tested');
  const [firestoreMessage, setFirestoreMessage] = useState<string>('');
  
  // Stati per Storage
  const [storageStatus, setStorageStatus] = useState<Status>('not_tested');
  const [storageMessage, setStorageMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Testa la connessione Firebase
  useEffect(() => {
    if (app) {
      setFirebaseStatus('success');
    } else {
      setFirebaseStatus('error');
    }
  }, []);
  
  // Gestisce il login di test
  const handleTestAuth = async () => {
    setAuthStatus('testing');
    try {
      // Puoi usare credenziali di test o usare quelle inserite dall'utente
      await signInWithEmailAndPassword(auth, email, password);
      setAuthStatus('success');
      setAuthMessage('Login effettuato con successo!');
      
      // Logout dopo un login di successo
      setTimeout(async () => {
        await signOut(auth);
      }, 2000);
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthStatus('error');
      setAuthMessage(`Errore di autenticazione: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Test di Firestore
  const testFirestore = async () => {
    setFirestoreStatus('testing');
    try {
      // Crea una collezione di test
      const testCollection = collection(db, 'test_collection');
      
      // Crea un documento di test con un timestamp
      const testDoc = {
        testField: 'Questo è un test',
        timestamp: Timestamp.now(),
        testNumber: 42
      };
      
      // Scrivi il documento
      const docRef = await addDoc(testCollection, testDoc);
      console.log('Test document written with ID: ', docRef.id);
      
      // Leggi il documento appena creato
      const docSnap = await getDoc(doc(db, 'test_collection', docRef.id));
      
      if (docSnap.exists()) {
        console.log('Test document read successfully:', docSnap.data());
        
        // Opzionale: elimina il documento di test dopo il test
        await deleteDoc(doc(db, 'test_collection', docRef.id));
        console.log('Test document deleted successfully');
        
        setFirestoreStatus('success');
        setFirestoreMessage('Firestore funzionante! Scrittura e lettura completate con successo.');
      } else {
        console.error('Test document not found after writing!');
        setFirestoreStatus('error');
        setFirestoreMessage('Errore: il documento è stato scritto ma non è stato possibile leggerlo.');
      }
    } catch (error) {
      console.error('Firestore test error:', error);
      setFirestoreStatus('error');
      setFirestoreMessage(`Errore nel test Firestore: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Test di Storage
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const testStorage = async () => {
    if (!selectedFile) return;
    
    setStorageStatus('testing');
    try {
      // Crea un riferimento univoco per il file di test
      const testFileRef = ref(storage, `test_files/${Date.now()}_${selectedFile.name}`);
      
      // Carica il file
      await uploadBytes(testFileRef, selectedFile);
      console.log('Test file uploaded successfully');
      
      // Ottieni l'URL del file caricato
      const downloadURL = await getDownloadURL(testFileRef);
      console.log('Test file URL:', downloadURL);
      
      setStorageStatus('success');
      setStorageMessage(`File caricato con successo! URL: ${downloadURL}`);
    } catch (error) {
      console.error('Storage test error:', error);
      setStorageStatus('error');
      setStorageMessage(`Errore nel test Storage: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Funzione di reset status per testing
  const resetStatuses = () => {
    setAuthStatus('not_tested');
    setFirestoreStatus('not_tested');
    setStorageStatus('not_tested');
    setAuthMessage('');
    setFirestoreMessage('');
    setStorageMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Connessione Firebase</h1>
        
        {/* Nota informativa */}
        <div className="mb-8 p-4 bg-blue-900/30 border border-blue-600 rounded-lg">
          <h3 className="font-semibold text-blue-400 mb-2">Informazioni</h3>
          <p className="text-blue-100">
            Questa pagina permette di testare la connessione ai servizi Firebase.
            <br />
            La configurazione è in modalità <strong>produzione</strong>, quindi tutte le operazioni sono eseguite sul progetto Firebase reale.
          </p>
        </div>
        
        {/* Status connessione Firebase */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">1. Connessione Firebase</h2>
          <div className="flex items-center">
            {firebaseStatus === 'success' ? (
              <div className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                <span>Firebase collegato correttamente al progetto!</span>
              </div>
            ) : firebaseStatus === 'error' ? (
              <div className="flex items-center">
                <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                <span>Errore di connessione a Firebase</span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Verifica in corso...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Test Autenticazione */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">2. Test Autenticazione</h2>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-2 bg-gray-700 rounded-md"
              placeholder="Inserisci email per il test"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-2 bg-gray-700 rounded-md"
              placeholder="Inserisci password per il test"
            />
          </div>
          <button 
            onClick={handleTestAuth} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            disabled={authStatus === 'testing' || !email || !password}
          >
            Test Autenticazione
          </button>
          
          {authStatus === 'success' && (
            <div className="mt-2 flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              <span>Autenticazione funzionante! {authMessage}</span>
            </div>
          )}
          {authStatus === 'error' && (
            <div className="mt-2 flex items-center">
              <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
              <span>Errore di autenticazione: {authMessage}</span>
            </div>
          )}
          {authStatus === 'testing' && (
            <div className="mt-2 flex items-center">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Test di autenticazione in corso...</span>
            </div>
          )}
        </div>
        
        {/* Test Database Firestore */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">3. Test Database Firestore</h2>
          <div className="flex space-x-4 mb-4">
            <button 
              onClick={testFirestore} 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              disabled={firestoreStatus === 'testing'}
            >
              Test Firestore
            </button>
          </div>
          
          {firestoreStatus === 'success' && (
            <div className="mt-2 flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              <span>{firestoreMessage}</span>
            </div>
          )}
          {firestoreStatus === 'error' && (
            <div className="mt-2 flex items-center">
              <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
              <span>{firestoreMessage}</span>
            </div>
          )}
          {firestoreStatus === 'testing' && (
            <div className="mt-2 flex items-center">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Test di Firestore in corso...</span>
            </div>
          )}
          {firestoreStatus === 'not_tested' && (
            <div className="mt-2 flex items-center">
              <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
              <span>Non testato</span>
            </div>
          )}
        </div>
        
        {/* Test Storage */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">4. Test Storage</h2>
          <div className="mb-4">
            <label className="block mb-2">Seleziona file:</label>
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="p-2 bg-gray-700 rounded-md"
            />
          </div>
          <button 
            onClick={testStorage} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            disabled={storageStatus === 'testing' || !selectedFile}
          >
            Carica File di Test
          </button>
          
          {storageStatus === 'success' && (
            <div className="mt-2 flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              <span>{storageMessage}</span>
            </div>
          )}
          {storageStatus === 'error' && (
            <div className="mt-2 flex items-center">
              <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
              <span>{storageMessage}</span>
            </div>
          )}
          {storageStatus === 'testing' && (
            <div className="mt-2 flex items-center">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Test di Storage in corso...</span>
            </div>
          )}
        </div>
        
        {/* Reset Button */}
        <div className="flex justify-center">
          <button 
            onClick={resetStatuses} 
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Reset Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTestPage; 