import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';

export interface CourseRegistration {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  timeSlot: string;
  paymentOption?: 'full' | 'installments';
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

// Aggiungi una nuova iscrizione
export const addCourseRegistration = async (registration: Omit<CourseRegistration, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log('🔥 Firebase DB object:', db);
    console.log('📦 Collection name: courseRegistrations');
    console.log('📋 Data to save:', registration);
    
    if (!db) {
      throw new Error('Firestore non è inizializzato correttamente. Controlla la configurazione Firebase.');
    }
    
    // Rimuovi campi undefined (Firestore non li accetta)
    const cleanData: any = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    // Copia solo i campi con valori definiti
    Object.keys(registration).forEach(key => {
      const value = (registration as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        cleanData[key] = value;
      }
    });
    
    console.log('🧹 Dati puliti (senza undefined):', cleanData);
    
    const docRef = await addDoc(collection(db, 'courseRegistrations'), cleanData);
    
    console.log('✅ Document salvato con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Errore durante l\'aggiunta dell\'iscrizione:', error);
    if (error instanceof Error) {
      console.error('❌ Messaggio errore:', error.message);
      console.error('❌ Stack trace:', error.stack);
    }
    throw error;
  }
};

// Ottieni tutte le iscrizioni
export const getAllCourseRegistrations = async (): Promise<CourseRegistration[]> => {
  try {
    const q = query(collection(db, 'courseRegistrations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const registrations: CourseRegistration[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      registrations.push({
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        timeSlot: data.timeSlot,
        paymentOption: data.paymentOption,
        message: data.message,
        status: data.status || 'pending',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
    
    return registrations;
  } catch (error) {
    console.error('Errore durante il recupero delle iscrizioni:', error);
    throw error;
  }
};

// Aggiorna un'iscrizione
export const updateCourseRegistration = async (id: string, updates: Partial<CourseRegistration>): Promise<void> => {
  try {
    const docRef = doc(db, 'courseRegistrations', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'iscrizione:', error);
    throw error;
  }
};

// Elimina un'iscrizione
export const deleteCourseRegistration = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'courseRegistrations', id));
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'iscrizione:', error);
    throw error;
  }
};
