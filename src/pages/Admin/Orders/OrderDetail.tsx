import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import '../AdminOrders.css';

const statusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "processing", label: "En proceso" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" }
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Buscar la orden en todas las órdenes de todos los usuarios
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      for (const u of users) {
        const userOrders = localStorage.getItem(`orders_${u.email}`);
        if (userOrders) {
          const orders = JSON.parse(userOrders);
          const found = orders.find((o: any) => o.id === id);
          if (found) {
            setOrder(found);
            setUserEmail(u.email);
            break;
          }
        }
      }
    }
  }, [id]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!userEmail) return;
    const newStatus = e.target.value;
    const userOrders = localStorage.getItem(`orders_${userEmail}`);
    if (userOrders) {
      const orders = JSON.parse(userOrders);
      const updatedOrders = orders.map((o: any) =>
        o.id === id ? { ...o, status: newStatus } : o
      );
      localStorage.setItem(`orders_${userEmail}`, JSON.stringify(updatedOrders));
      setOrder((prev: any) => ({ ...prev, status: newStatus }));
      window.dispatchEvent(new Event('storage'));
    }
  };

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
              <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="order-status">
              <select
                value={order.status}
                onChange={handleStatusChange}
                className={`status-select status-${order.status}`}
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
              <p>{order.shippingDetails?.fullName}</p>
              <p>{order.shippingDetails?.email}</p>
              <p>{order.shippingDetails?.phone}</p>
            </div>
            <div className="shipping-info">
              <h4>Envío</h4>
              <p>{order.shippingDetails?.address}</p>
              <p>{order.shippingDetails?.city}</p>
            </div>
            <div className="order-summary">
              <h4>Resumen</h4>
              <p>{order.items?.length} productos</p>
              <p className="order-total">Total: S/ {order.total?.toFixed(2)}</p>
              <ul>
                {order.items?.map((item: any, idx: number) => (
                  <li key={idx}>{item.name} x {item.quantity}</li>
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
