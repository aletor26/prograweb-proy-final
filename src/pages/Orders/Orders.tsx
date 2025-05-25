import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Orders.css';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingDetails: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    phone: string;
  };
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'qr' | 'credit-card';
}

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  const fetchOrders = async () => {
    try {
      if (!user?.email) return;
      const storedOrders = localStorage.getItem(`orders_${user.email}`);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Escuchar cambios en el localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (user?.email && e.key === `orders_${user.email}`) {
        fetchOrders();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user?.email]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'En proceso';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getShippingMethodText = (method: Order['shippingMethod']) => {
    return method === 'standard' ? 'Envío estándar (3-5 días)' : 'Envío express (1-2 días)';
  };

  const getPaymentMethodText = (method: Order['paymentMethod']) => {
    return method === 'qr' ? 'Pago con QR' : 'Tarjeta de crédito';
  };

  if (isLoading) {
    return (
      <div className="orders-container">
        <div className="orders-loading">
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">
        {isAdmin ? 'Gestión de Pedidos' : 'Mis Pedidos'}
      </h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No hay pedidos {isAdmin ? 'registrados' : 'realizados'}</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link 
              to={`/orders/${order.id}`} 
              key={order.id} 
              className="order-card"
            >
              <div className="order-header">
                <div>
                  <h3 className="order-id">Pedido #{order.id}</h3>
                  <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span className={`order-status ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="order-details">
                <div className="order-section">
                  <h4>Detalles de envío</h4>
                  <p>{order.shippingDetails.fullName}</p>
                  <p>{order.shippingDetails.address}</p>
                  <p>{order.shippingDetails.city}</p>
                  <p>{order.shippingDetails.phone}</p>
                  <p className="shipping-method">{getShippingMethodText(order.shippingMethod)}</p>
                </div>

                <div className="order-section">
                  <h4>Método de pago</h4>
                  <p>{getPaymentMethodText(order.paymentMethod)}</p>
                </div>
              </div>

              <div className="order-items">
                <h4>Productos</h4>
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">S/ {item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <span className="order-total">
                  Total: S/ {order.total.toFixed(2)}
                </span>
                {isAdmin && (
                  <div className="admin-indicator">
                    <span>Click para gestionar pedido</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 