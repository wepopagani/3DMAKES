import { collection, addDoc, doc, getDoc, getDocs, query, where, orderBy, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';

export interface ShopOrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  customization?: {
    notes?: string;
    referenceImages?: string[];
  };
}

export interface ShopOrder {
  id?: string;
  userId: string | null;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'shipping' | 'pickup';
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
  } | null;
  items: ShopOrderItem[];
  totalAmount: number;
  notes?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

// Crea un nuovo ordine shop
export const createShopOrder = async (orderData: Omit<ShopOrder, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'shopOrders'), {
      ...orderData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating shop order:', error);
    throw error;
  }
};

// Ottieni un ordine per ID
export const getShopOrderById = async (orderId: string): Promise<ShopOrder | null> => {
  try {
    const docRef = doc(db, 'shopOrders', orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ShopOrder;
    }
    return null;
  } catch (error) {
    console.error('Error getting shop order:', error);
    throw error;
  }
};

// Ottieni tutti gli ordini di un utente
export const getUserShopOrders = async (userId: string): Promise<ShopOrder[]> => {
  try {
    const q = query(
      collection(db, 'shopOrders'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const orders: ShopOrder[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as ShopOrder);
    });
    
    // Ordina manualmente per data in JavaScript
    return orders.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : (a.createdAt as any).toDate();
      const dateB = b.createdAt instanceof Date ? b.createdAt : (b.createdAt as any).toDate();
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error getting user shop orders:', error);
    throw error;
  }
};

// Ottieni tutti gli ordini (admin)
export const getAllShopOrders = async (): Promise<ShopOrder[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'shopOrders'));
    const orders: ShopOrder[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as ShopOrder);
    });
    
    // Ordina manualmente per data in JavaScript
    return orders.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : (a.createdAt as any).toDate();
      const dateB = b.createdAt instanceof Date ? b.createdAt : (b.createdAt as any).toDate();
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error getting all shop orders:', error);
    throw error;
  }
};

// Aggiorna lo stato di un ordine
export const updateShopOrderStatus = async (
  orderId: string, 
  status: ShopOrder['status']
): Promise<void> => {
  try {
    const docRef = doc(db, 'shopOrders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating shop order status:', error);
    throw error;
  }
};

// Aggiorna lo stato del pagamento
export const updateShopOrderPaymentStatus = async (
  orderId: string, 
  paymentStatus: ShopOrder['paymentStatus']
): Promise<void> => {
  try {
    const docRef = doc(db, 'shopOrders', orderId);
    await updateDoc(docRef, {
      paymentStatus,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating shop order payment status:', error);
    throw error;
  }
};

// Elimina un ordine shop
export const deleteShopOrder = async (orderId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'shopOrders', orderId));
  } catch (error) {
    console.error('Error deleting shop order:', error);
    throw error;
  }
};

