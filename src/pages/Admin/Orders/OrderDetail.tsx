import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPedidoAdmin, cancelarPedidoAdmin, actualizarEstadoPedidoAdmin } from "../../../services/pedidosservicio";
import '../AdminOrders.css';

const statusOptions = [
  { value: 1, label: "Pendiente" },
  { value: 2, label: "Procesando" },
  { value: 3, label: "Completado" },
  { value: 4, label: "Cancelado" }
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setError(null);
        if (id) {
          const orderData = await getPedidoAdmin(parseInt(id));
          setOrder(orderData);
        }
      } catch (error: any) {
        console.error('❌ Error fetching order:', error);
        setError(error.error || 'Error al cargar la orden');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.estado);
      setHasChanges(false);
    }
  }, [order]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = parseInt(e.target.value);
    setSelectedStatus(newStatus);
    setHasChanges(newStatus !== order.estado);
  };

  const handleSaveStatus = async () => {
    if (selectedStatus === null || selectedStatus === order.estado) return;
    try {
      await actualizarEstadoPedidoAdmin(Number(id), selectedStatus);
      // Recargar el pedido actualizado
      const updatedOrder = await getPedidoAdmin(Number(id));
      setOrder(updatedOrder);
      setHasChanges(false);
    } catch (error) {
      alert('Error al actualizar el estado');
    }
  };

  if (isLoading) {
    return (
      <div>
        <p>Cargando orden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error al cargar la orden</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <p>ID del pedido: {id}</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <h2>Orden no encontrada</h2>
        <p>ID del pedido: {id}</p>
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
              <h3>Pedido #{order.numero}</h3>
              <p className="order-date">{new Date(order.fecha).toLocaleDateString()}</p>
            </div>
            <div className="order-status">
              <div style={{ fontWeight: 500, marginBottom: 4 }}>
                Estado actual: {order.estadoNombre || statusOptions.find(opt => opt.value === (selectedStatus ?? order.estado))?.label}
              </div>
              <select
                value={selectedStatus ?? order.estado}
                onChange={handleStatusChange}
                className={`status-select status-${selectedStatus ?? order.estado}`}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {hasChanges && (
                <button onClick={handleSaveStatus} style={{ marginLeft: 10 }}>
                  Guardar cambios
                </button>
              )}
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
