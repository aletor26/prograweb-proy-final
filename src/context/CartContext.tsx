import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  description?: string;
}

interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  moveToSaved: (productOrId: number | Product) => void;
  moveToCart: (productId: number) => void;
  removeSavedItem: (productId: number) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('savedItems');
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en localStorage cada vez que cambian los productos guardados
  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
  }, [savedItems]);

const addToCart = (product: Product, quantity = 1) => {
  setItems(currentItems => {
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      return currentItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    }

    return [...currentItems, { ...product, quantity }];
  });
};


  const removeFromCart = (productId: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const moveToSaved = (productOrId: number | Product) => {
    let item: CartItem | undefined;
    if (typeof productOrId === 'number') {
      item = items.find(i => i.id === productOrId);
      // Si no está en el carrito, buscar en savedItems para evitar duplicados
      if (!item && !savedItems.some(i => i.id === productOrId)) {
        // Buscar en localStorage o pedir el producto como argumento
        // Aquí asumimos que el botón pasa el objeto Product si no está en el carrito
        return;
      }
    } else {
      // Si se pasa el objeto Product directamente
      item = { ...productOrId, quantity: 1 };
    }
    if (item && !savedItems.some(i => i.id === item!.id)) {
      setSavedItems(current => [...current, item!]);
      removeFromCart(item.id);
    }
  };

  const moveToCart = (productId: number) => {
    const item = savedItems.find(item => item.id === productId);
    if (item) {
      addToCart(item);
      removeSavedItem(productId);
    }
  };

  const removeSavedItem = (productId: number) => {
    setSavedItems(current => current.filter(item => item.id !== productId));
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        savedItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        moveToSaved,
        moveToCart,
        removeSavedItem,
        total
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