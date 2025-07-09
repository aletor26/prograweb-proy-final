import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminOrders.css';

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
}

const AdminOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario es admin
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    // Cargar órdenes
    const loadOrders = () => {
      const allOrders: Order[] = [];
      const users = localStorage.getItem('users');
      if (users) {
        JSON.parse(users).forEach((user: any) => {
          const userOrders = localStorage.getItem(`orders_${user.email}`);
          if (userOrders) {
            allOrders.push(...JSON.parse(userOrders));
          }
        });
      }
      setOrders(allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setIsLoading(false);
    };

    loadOrders();
  }, [user, navigate]);

  const updateOrderStatus = (orderId: string, userEmail: string, newStatus: Order['status']) => {
    const userOrders = localStorage.getItem(`orders_${userEmail}`);
    if (userOrders) {
      const updatedOrders = JSON.parse(userOrders).map((order: Order) => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      localStorage.setItem(`orders_${userEmail}`, JSON.stringify(updatedOrders));
      
      // Actualizar estado local
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };


  if (isLoading) {
    return (
      <div className="admin-orders">
        <div className="loading">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1>Gestión de Pedidos</h1>
      </div>

      <div className="orders-section">
        <div className="orders-list">
          {orders.length === 0 ? (
            <p className="no-data">No hay pedidos registrados</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Pedido #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(
                        order.id,
                        order.shippingDetails.email,
                        e.target.value as Order['status']
                      )}
                      className={`status-select ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="processing">En proceso</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
                <div className="order-details">
                  <div className="customer-info">
                    <h4>Cliente</h4>
                    <p>{order.shippingDetails.fullName}</p>
                    <p>{order.shippingDetails.email}</p>
                    <p>{order.shippingDetails.phone}</p>
                  </div>
                  <div className="shipping-info">
                    <h4>Envío</h4>
                    <p>{order.shippingDetails.address}</p>
                    <p>{order.shippingDetails.city}</p>
                  </div>
                  <div className="order-summary">
                    <h4>Resumen</h4>
                    <p>{order.items.length} productos</p>
                    <p className="order-total">Total: S/ {order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders; 