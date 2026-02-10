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
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

// Aggiungi una nuova iscrizione
export const addCourseRegistration = async (registration: Omit<CourseRegistration, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'courseRegistrations'), {
      ...registration,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Errore durante l\'aggiunta dell\'iscrizione:', error);
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
