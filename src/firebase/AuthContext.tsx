import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './config';
import { db } from './config';
import { doc, setDoc } from 'firebase/firestore';

// Interfaccia per i dati dell'utente
export interface UserData {
  nome: string;
  cognome: string;
  telefono: string;
  indirizzo: string;
  citta: string;
  cap: string;
  email: string;
}

// Definisci il tipo per il contesto
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: UserData) => Promise<UserCredential>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logInWithGoogle: () => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

// Crea il contesto
const AuthContext = createContext<AuthContextType | null>(null);

// Hook personalizzato per utilizzare il contesto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
  }
  return context;
}

// Props per il provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider del contesto
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Funzione per la registrazione che include la creazione del profilo
  async function signUp(email: string, password: string, userData: UserData) {
    // Prima creiamo l'account con Firebase Auth
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    
    // Poi salviamo i dati utente in Firestore
    await setDoc(doc(db, "users", credentials.user.uid), {
      nome: userData.nome,
      cognome: userData.cognome,
      telefono: userData.telefono,
      indirizzo: userData.indirizzo,
      citta: userData.citta,
      cap: userData.cap,
      email: userData.email,
      createdAt: new Date(),
      lastLogin: new Date()
    });
    
    return credentials;
  }

  // Funzione per il login
  async function logIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Funzione per il login con Google
  async function logInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  // Funzione per il logout
  async function logOut() {
    return signOut(auth);
  }

  // Effetto per monitorare lo stato dell'autenticazione
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Valori forniti dal contesto
  const value = {
    currentUser,
    loading,
    signUp,
    logIn,
    logInWithGoogle,
    logOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 