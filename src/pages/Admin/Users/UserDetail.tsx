import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './UserDetail.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastName?: string;
}

interface Order {
  id: string;
  userId: string;
  total: number;
  date: string;
}

export default function UserDetail() {
  const { user } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    setDetail(users.find((u: User) => u.id === userId) || null);

    const storedOrders = localStorage.getItem('orders');
    const allOrders = storedOrders ? JSON.parse(storedOrders) : [];
    setOrders(allOrders.filter((o: Order) => o.userId === userId).slice(0, 10));
  }, [userId]);

  if (user?.role !== 'admin') {
    return <div>No autorizado</div>;
  }

  if (!detail) return <div>Usuario no encontrado</div>;

  return (
    <div className="user-detail-container">
      <h1>Detalle de Usuario</h1>
      <p><b>Nombre:</b> {detail.name} {detail.lastName}</p>
      <p><b>Email:</b> {detail.email}</p>
      <p><b>Rol:</b> {detail.role}</p>
      <p><b>Estado:</b> {detail.active ? 'Activo' : 'Inactivo'}</p>
      <h2>Órdenes recientes</h2>
      <table className="user-orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>S/ {o.total.toFixed(2)}</td>
              <td>{o.date}</td>
              <td>
                <button onClick={() => navigate(`/admin/orders/${o.id}`)}>
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/admin/users')}>Volver</button>
    </div>
  );
}