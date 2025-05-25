import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './OrderDetail.css';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
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

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchOrder = () => {
      try {
        if (!user?.email) return;
        const storedOrders = localStorage.getItem(`orders_${user.email}`);
        if (storedOrders) {
          const orders = JSON.parse(storedOrders);
          const foundOrder = orders.find((o: Order) => o.id === orderId);
          setOrder(foundOrder || null);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user?.email]);

  const updateOrderStatus = (newStatus: Order['status']) => {
    if (!user?.email || !order) return;

    try {
      const storedOrders = localStorage.getItem(`orders_${user.email}`);
      if (storedOrders) {
        const orders = JSON.parse(storedOrders);
        const updatedOrders = orders.map((o: Order) => {
          if (o.id === orderId) {
            return { ...o, status: newStatus };
          }
          return o;
        });

        localStorage.setItem(`orders_${user.email}`, JSON.stringify(updatedOrders));
        setOrder({ ...order, status: newStatus });
        
        // Si se está cancelando, cerrar el diálogo de confirmación
        if (newStatus === 'cancelled') {
          setShowCancelConfirm(false);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelOrder = () => {
    updateOrderStatus('cancelled');
  };

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
      <div className="order-detail-container">
        <div className="order-detail-loading">
          <p>Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-container">
        <div className="order-detail-error">
          <h2>Pedido no encontrado</h2>
          <button onClick={() => navigate('/orders')} className="back-button">
            Volver a mis pedidos
          </button>
        </div>
      </div>
    );
  }

  const canCancelOrder = !isAdmin && (order.status === 'pending' || order.status === 'processing');

  return (
    <div className="order-detail-container">
      {showCancelConfirm && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>¿Estás seguro que deseas cancelar este pedido?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowCancelConfirm(false)}
                className="modal-button secondary"
              >
                No, mantener pedido
              </button>
              <button 
                onClick={confirmCancelOrder}
                className="modal-button primary"
              >
                Sí, cancelar pedido
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="order-detail-card">
        <div className="order-detail-header">
          <div className="order-detail-title">
            <h1>Pedido #{order.id}</h1>
            <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
          </div>
          <div className="order-status-section">
            <span className={`order-status ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
            {isAdmin ? (
              <div className="admin-controls">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(e.target.value as Order['status'])}
                  className="status-select"
                >
                  <option value="pending">Pendiente</option>
                  <option value="processing">En proceso</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            ) : canCancelOrder && (
              <button 
                onClick={handleCancelOrder}
                className="cancel-order-button"
              >
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>

        <div className="order-info-section">
          <h2>Detalles de envío</h2>
          <div className="shipping-details">
            <p><strong>Nombre:</strong> {order.shippingDetails.fullName}</p>
            <p><strong>Email:</strong> {order.shippingDetails.email}</p>
            <p><strong>Dirección:</strong> {order.shippingDetails.address}</p>
            <p><strong>Ciudad:</strong> {order.shippingDetails.city}</p>
            <p><strong>Teléfono:</strong> {order.shippingDetails.phone}</p>
            <p><strong>Método de envío:</strong> {getShippingMethodText(order.shippingMethod)}</p>
          </div>
        </div>

        <div className="order-info-section">
          <h2>Método de pago</h2>
          <p>{getPaymentMethodText(order.paymentMethod)}</p>
        </div>

        <div className="order-items-section">
          <h2>Productos</h2>
          <div className="order-items-list">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">S/ {item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-total-section">
          <div className="order-total">
            <span>Total</span>
            <span>S/ {order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="order-actions">
          <button onClick={() => navigate('/orders')} className="back-button">
            Volver a mis pedidos
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 