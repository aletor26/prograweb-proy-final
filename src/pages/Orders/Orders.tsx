import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Paginacion from '../../components/Paginacion/Paginacion';
import './Orders.css';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pendiente' | 'Procesado' | 'Completado' | 'Cancelado';
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

const ORDERS_PER_PAGE = 3;

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      await new Promise(resolve => setTimeout(resolve, 1000));
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

  const handleCancelOrder = (orderId: string) => {
    setShowCancelConfirm(orderId);
  };

  const confirmCancelOrder = (orderId: string) => {
    if (!user?.email) return;

    try {
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: 'Cancelado' as const };
        }
        return order;
      });

      localStorage.setItem(`orders_${user.email}`, JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      setShowCancelConfirm(null);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pendiente':
        return 'status-pending';
      case 'Procesado':
        return 'status-processing';
      case 'Completado':
        return 'status-completed';
      case 'Cancelado':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  // Paginación
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  useEffect(() => {
    // Si la página actual queda fuera de rango después de eliminar/cancelar, ajusta
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [orders, totalPages, currentPage]);

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
      {showCancelConfirm && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>¿Estás seguro que deseas cancelar este pedido?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowCancelConfirm(null)}
                className="modal-button secondary"
              >
                No, mantener pedido
              </button>
              <button 
                onClick={() => confirmCancelOrder(showCancelConfirm)}
                className="modal-button primary"
              >
                Sí, cancelar pedido
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="orders-title">
        {isAdmin ? 'Gestión de Pedidos' : 'Mis Pedidos'}
      </h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No hay pedidos {isAdmin ? 'registrados' : 'realizados'}</p>
        </div>
      ) : (
        <>
          <div className="orders-list">
            <div className="orders-list-header">
              <span>ID</span>
              <span>Fecha</span>
              <span>Estado</span>
              <span>Total</span>
              <span>Acciones</span>
            </div>
            {paginatedOrders.map((order) => (
              <div key={order.id} className="order-row">
                <span>#{order.id}</span>
                <span>{new Date(order.date).toLocaleDateString()}</span>
                <span className={`order-status ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span>S/ {order.total.toFixed(2)}</span>
                <span>
                  <Link to={`/orders/${order.id}`} className="view-details-button">
                    Ver detalles
                  </Link>
                  {!isAdmin && (order.status === 'Pendiente' || order.status === 'Procesado') && (
                    <button 
                      onClick={() => handleCancelOrder(order.id)}
                      className="cancel-order-button"
                    >
                      Cancelar
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Orders;