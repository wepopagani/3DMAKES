import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // ID unico del carrello (può includere timestamp per prodotti custom)
  productId: string; // ID del prodotto originale
  name: string;
  price: number;
  quantity: number;
  image: string;
  customization?: {
    notes?: string;
    referenceImages?: string[]; // URLs delle immagini caricate dall'utente
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  updateItemCustomization: (id: string, customization: CartItem['customization']) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Carica il carrello dal localStorage all'avvio
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Salva il carrello nel localStorage ogni volta che cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      // Per prodotti personalizzabili, crea un ID univoco con timestamp
      // così ogni personalizzazione è un item separato
      if (newItem.customization) {
        const uniqueItem = {
          ...newItem,
          id: `${newItem.productId}-${Date.now()}`, // ID univoco
          quantity: 1
        };
        return [...prevItems, uniqueItem];
      }
      
      // Per prodotti normali, controlla se esiste già
      const existingItem = prevItems.find(item => item.productId === newItem.productId && !item.customization);
      
      if (existingItem) {
        // Se il prodotto esiste già e non è personalizzabile, aumenta la quantità
        return prevItems.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Altrimenti aggiungi il nuovo prodotto
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const updateItemCustomization = (id: string, customization: CartItem['customization']) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, customization } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        updateItemCustomization,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

