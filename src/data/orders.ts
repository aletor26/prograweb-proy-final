import type { Product } from './products';

export interface OrderItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
}

export const saveOrder = (order: Order, userEmail: string) => {
  try {
    // Obtener órdenes existentes
    const existingOrders = localStorage.getItem(`orders_${userEmail}`);
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    
    // Agregar nueva orden
    orders.push(order);
    
    // Guardar en localStorage
    localStorage.setItem(`orders_${userEmail}`, JSON.stringify(orders));
    
    return true;
  } catch (error) {
    console.error('Error saving order:', error);
    return false;
  }
};

export const getOrders = (userEmail: string): Order[] => {
  try {
    const orders = localStorage.getItem(`orders_${userEmail}`);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

export const generateOrderId = (): string => {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}; 