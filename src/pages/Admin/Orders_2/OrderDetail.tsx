import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './OrderDetail.css';

interface Order {
  id: string;
  userId: string;
  total: number;
  date: string;
  status?: string;
  items?: { name: string; quantity: number; price: number }[];
}

export default function OrderDetail() {
  const { user } = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    const orders = storedOrders ? JSON.parse(storedOrders) : [];
    setOrder(orders.find((o: Order) => o.id === orderId) || null);
  }, [orderId]);

  const handleCancel = () => {
    if (!order) return;
    const storedOrders = localStorage.getItem('orders');
    let orders = storedOrders ? JSON.parse(storedOrders) : [];
    orders = orders.map((o: Order) =>
      o.id === order.id ? { ...o, status: 'cancelled' } : o
    );
    localStorage.setItem('orders', JSON.stringify(orders));
    setOrder({ ...order, status: 'cancelled' });
  };

  if (user?.role !== 'admin') {
    return <div>No autorizado</div>;
  }

  if (!order) return <div>Orden no encontrada</div>;

  return (
    <div className="order-detail-container">
      <h1>Detalle de Orden</h1>
      <p><b>ID:</b> {order.id}</p>
      <p><b>Usuario:</b> {order.userId}</p>
      <p><b>Total:</b> S/ {order.total.toFixed(2)}</p>
      <p><b>Fecha:</b> {order.date}</p>
      <p><b>Estado:</b> {order.status || 'pendiente'}</p>
      <h3>Productos:</h3>
      <ul>
        {order.items?.map((item, idx) => (
          <li key={idx}>
            {item.name} - Cantidad: {item.quantity} - S/ {item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      {order.status !== 'cancelled' && (
        <button onClick={handleCancel}>Cancelar Orden</button>
      )}
      <button onClick={() => navigate('/admin/orders')}>Volver</button>
    </div>
  );
}