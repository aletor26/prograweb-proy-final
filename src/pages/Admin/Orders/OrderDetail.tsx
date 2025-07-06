import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPedidoAdmin, cancelarPedidoAdmin } from "../../../services/pedidosservicio";
import '../AdminOrders.css';

const statusOptions = [
  { value: 1, label: "Pendiente" },
  { value: 3, label: "En proceso" },
  { value: 5, label: "Entregado" },
  { value: 2, label: "Cancelado" }
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (id) {
          const orderData = await getPedidoAdmin(parseInt(id));
          setOrder(orderData);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const newStatus = parseInt(e.target.value);
      if (newStatus === 4) {
        // Si se está cancelando, usar la función de cancelar
        await cancelarPedidoAdmin(parseInt(id!));
      }
      // Actualizar el estado local
      setOrder((prev: any) => ({ ...prev, estado: newStatus }));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <p>Cargando orden...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <h2>Orden no encontrada</h2>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1>Detalle de Orden</h1>
      </div>
      <div className="orders-section">
        <div className="order-card">
          <div className="order-header">
            <div className="order-info">
              <h3>Pedido #{order.id}</h3>
              <p className="order-date">{new Date(order.fecha).toLocaleDateString()}</p>
            </div>
            <div className="order-status">
              <select
                value={order.estado}
                onChange={handleStatusChange}
                className={`status-select status-${order.estado}`}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="order-details">
            <div className="customer-info">
              <h4>Cliente</h4>
              <p>{order.cliente?.nombre} {order.cliente?.apellido}</p>
              <p>{order.cliente?.email}</p>
              <p>{order.cliente?.telefono}</p>
            </div>
            <div className="shipping-info">
              <h4>Envío</h4>
              <p>{order.cliente?.direccion}</p>
            </div>
            <div className="order-summary">
              <h4>Resumen</h4>
              <p>{order.items?.length || 0} productos</p>
              <p className="order-total">Total: S/ {order.total?.toFixed(2)}</p>
              <ul>
                {order.items?.map((item: any, idx: number) => (
                  <li key={idx}>{item.nombre || item.name} x {item.cantidad || item.quantity}</li>
                ))}
              </ul>
            </div>
          </div>
          <button onClick={() => navigate(-1)} style={{ marginTop: 10 }}>Volver</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
