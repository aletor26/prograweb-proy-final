import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Paginacion from '../../components/Paginacion/Paginacion';
import { getPedidosCliente, cancelarPedidoUsuario } from '../../services/clienteservicios';
import './Orders.css';

interface Order {
  id: number;
  numero: string;
  fecha_pedido: string;
  precio_total: number;
  estadoPedidoId: number;
  // Puedes agregar más campos según lo que retorne el backend
}

const ORDERS_PER_PAGE = 3;

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const data = await getPedidosCliente(Number(user.id), currentPage, ORDERS_PER_PAGE);
        setOrders(data.rows || data || []);
      } catch (error) {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user?.id, currentPage]);

  const handleCancelOrder = (orderId: string) => {
    setShowCancelConfirm(orderId);
  };

  const confirmCancelOrder = async (orderId: string) => {
    try {
      await cancelarPedidoUsuario(Number(orderId));
      // Recargar pedidos después de cancelar
      if (user?.id) {
        const data = await getPedidosCliente(Number(user.id), currentPage, ORDERS_PER_PAGE);
        setOrders(data.rows || data || []);
      }
      setShowCancelConfirm(null);
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error al cancelar el pedido');
    }
  };

  const getStatusColor = (status: Order['estadoPedidoId']) => {
    switch (status) {
      case 1:
        return 'status-pending';
      case 2:
        return 'status-processing';
      case 3:
        return 'status-completed';
      case 5:
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const totalPages = 1; // Puedes ajustar esto si el backend retorna el total de páginas
  const paginatedOrders = orders; // Ya viene paginado del backend

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
                <span>#{order.numero}</span>
                <span>{new Date(order.fecha_pedido).toLocaleDateString()}</span>
                <span className={`order-status ${getStatusColor(order.estadoPedidoId)}`}>
                  {order.estadoPedidoId === 1 ? 'Pendiente' : order.estadoPedidoId === 2 ? 'Procesado' : order.estadoPedidoId === 3 ? 'Completado' : 'Cancelado'}
                </span>
                <span>S/ {order.precio_total.toFixed(2)}</span>
                <span>
                  <Link to={`/orders/${order.id}`} className="view-details-button">
                    Ver detalles
                  </Link>
                  {!isAdmin && (order.estadoPedidoId === 1 || order.estadoPedidoId === 2) && (
                    <button 
                      onClick={() => handleCancelOrder(order.id.toString())}
                      className="cancel-order-button"
                    >
                      Cancelar
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
          {/* Paginación si el backend lo soporta */}
          {/* <Paginacion currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> */}
        </>
      )}
    </div>
  );
};

export default Orders;