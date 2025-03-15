import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  listAll 
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../firebase/AuthContext';

const TestConnection: React.FC = () => {
  // Stati per i test
  const [firebaseStatus, setFirebaseStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [authStatus, setAuthStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [dbStatus, setDbStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [storageStatus, setStorageStatus] = useState<'pending' | 'success' | 'error'>('pending');
  
  // Stati per i form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  // Usa il contesto di autenticazione
  const { logIn, signUp, currentUser } = useAuth();

  // Test della connessione Firebase
  useEffect(() => {
    try {
      if (auth && db && storage) {
        setFirebaseStatus('success');
      } else {
        setFirebaseStatus('error');
      }
    } catch (error) {
      console.error('Errore nella connessione Firebase:', error);
      setFirebaseStatus('error');
    }
  }, []);

  // Test di autenticazione
  const handleTestAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStatus('pending');
    try {
      // Tentativo di login
      await logIn(email, password);
      setAuthStatus('success');
      setLoginMessage('Login effettuato con successo!');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        try {
          // Se l'utente non esiste, registralo
          await signUp(email, password, {
            nome: '',
            cognome: '',
            telefono: '',
            indirizzo: '',
            citta: '',
            cap: '',
            email: email
          });
          setAuthStatus('success');
          setLoginMessage('Registrazione e login effettuati con successo!');
        } catch (registerError) {
          console.error('Errore durante la registrazione:', registerError);
          setAuthStatus('error');
          setLoginMessage('Errore durante la registrazione: ' + registerError);
        }
      } else {
        console.error('Errore durante il login:', error);
        setAuthStatus('error');
        setLoginMessage('Errore durante il login: ' + error.message);
      }
    }
  };

  // Test del database Firestore
  const handleTestDB = async () => {
    setDbStatus('pending');
    try {
      // Aggiungi un documento di test
      const testCollection = collection(db, 'tests');
      await addDoc(testCollection, {
        text: 'Test di connessione',
        timestamp: Timestamp.now()
      });
      
      // Leggi i documenti per verificare
      const querySnapshot = await getDocs(testCollection);
      if (!querySnapshot.empty) {
        setDbStatus('success');
      } else {
        setDbStatus('error');
      }
    } catch (error) {
      console.error('Errore nel test del database:', error);
      setDbStatus('error');
    }
  };

  // Test dello storage
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTestStorage = async () => {
    if (!file) {
      setUploadMessage('Seleziona un file prima di caricarlo');
      return;
    }

    setStorageStatus('pending');
    try {
      // Crea un riferimento univoco per il file
      const fileId = uuidv4();
      const fileExtension = file.name.split('.').pop();
      const storageRef = ref(storage, `test/${fileId}.${fileExtension}`);
      
      // Carica il file
      await uploadBytes(storageRef, file);
      
      // Ottieni l'URL del file
      const downloadURL = await getDownloadURL(storageRef);
      
      setUploadMessage(`File caricato con successo! URL: ${downloadURL}`);
      setStorageStatus('success');
    } catch (error) {
      console.error('Errore nel test dello storage:', error);
      setUploadMessage('Errore durante il caricamento del file');
      setStorageStatus('error');
    }
  };

  // Test della chat
  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser) return;
    
    try {
      // Aggiungi il messaggio a Firestore
      const messagesCollection = collection(db, 'messages');
      await addDoc(messagesCollection, {
        text: message,
        senderId: currentUser.uid,
        senderEmail: currentUser.email || 'Anonimo',
        createdAt: Timestamp.now(),
        recipientId: null // null per la chat globale
      });
      
      // Pulisci l'input
      setMessage('');
      
      // Aggiorna i messaggi
      await fetchMessages();
    } catch (error) {
      console.error('Errore nell\'invio del messaggio:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const messagesCollection = collection(db, 'messages');
      const querySnapshot = await getDocs(messagesCollection);
      const fetchedMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordina i messaggi per timestamp
      fetchedMessages.sort((a: any, b: any) => a.timestamp.seconds - b.timestamp.seconds);
      
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Errore nel recupero dei messaggi:', error);
    }
  };

  // Carica i messaggi all'avvio del componente
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Test delle Connessioni Firebase</h1>
      
      {/* Test Firebase */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">1. Test Connessione Firebase</h2>
        <div className="flex items-center">
          <div className={`h-4 w-4 rounded-full mr-2 ${
            firebaseStatus === 'pending' ? 'bg-yellow-500' :
            firebaseStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>
            {firebaseStatus === 'pending' ? 'Verifica in corso...' :
             firebaseStatus === 'success' ? 'Firebase connesso con successo!' : 'Errore nella connessione Firebase'}
          </span>
        </div>
      </div>
      
      {/* Test Autenticazione */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">2. Test Autenticazione</h2>
        <form onSubmit={handleTestAuth} className="mb-4">
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Test Autenticazione
          </button>
        </form>
        {loginMessage && (
          <div className="mt-2">
            <p>{loginMessage}</p>
          </div>
        )}
        <div className="flex items-center mt-2">
          <div className={`h-4 w-4 rounded-full mr-2 ${
            authStatus === 'pending' ? 'bg-yellow-500' :
            authStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>
            {authStatus === 'pending' ? 'Non testato' :
             authStatus === 'success' ? 'Autenticazione funzionante!' : 'Errore nell\'autenticazione'}
          </span>
        </div>
      </div>
      
      {/* Test Database */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">3. Test Database Firestore</h2>
        <button 
          onClick={handleTestDB}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4"
        >
          Test Database
        </button>
        <div className="flex items-center">
          <div className={`h-4 w-4 rounded-full mr-2 ${
            dbStatus === 'pending' ? 'bg-yellow-500' :
            dbStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>
            {dbStatus === 'pending' ? 'Non testato' :
             dbStatus === 'success' ? 'Database funzionante!' : 'Errore nel database'}
          </span>
        </div>
      </div>
      
      {/* Test Storage */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">4. Test Storage</h2>
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4"
          />
          <button 
            onClick={handleTestStorage}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            disabled={!file}
          >
            Carica File
          </button>
        </div>
        {uploadMessage && (
          <div className="mt-2">
            <p>{uploadMessage}</p>
          </div>
        )}
        <div className="flex items-center">
          <div className={`h-4 w-4 rounded-full mr-2 ${
            storageStatus === 'pending' ? 'bg-yellow-500' :
            storageStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>
            {storageStatus === 'pending' ? 'Non testato' :
             storageStatus === 'success' ? 'Storage funzionante!' : 'Errore nello storage'}
          </span>
        </div>
      </div>
      
      {/* Test Chat */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">5. Test Chat</h2>
        
        <div className="mb-4 h-64 overflow-y-auto bg-gray-700 p-4 rounded">
          {messages.map((msg: any) => (
            <div key={msg.id} className="mb-2">
              <span className="font-bold">{msg.sender}: </span>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
        
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-2 bg-gray-700 rounded-l"
            placeholder="Scrivi un messaggio..."
          />
          <button 
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r"
          >
            Invia
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestConnection; 