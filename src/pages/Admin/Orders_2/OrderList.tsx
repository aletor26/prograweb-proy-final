import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './OrderList.css';

interface Order {
  id: string;
  userId: string;
  total: number;
  date: string;
}

interface User {
  id: string;
  name: string;
  lastName?: string;
}

export default function OrderList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    setOrders(storedOrders ? JSON.parse(storedOrders) : []);
    const storedUsers = localStorage.getItem('users');
    setUsers(storedUsers ? JSON.parse(storedUsers) : []);
  }, []);

  const getUserName = (userId: string) => {
    const u = users.find(u => u.id === userId);
    return u ? `${u.name} ${u.lastName || ''}` : '';
  };

  const filtered = orders.filter(o => {
    const userName = getUserName(o.userId).toLowerCase();
    return (
      o.id.includes(filter) ||
      userName.includes(filter.toLowerCase())
    );
  });

  if (user?.role !== 'admin') {
    return <div>No autorizado</div>;
  }

  return (
    <div className="order-list-container">
      <h1>Listado de Órdenes</h1>
      <input
        type="text"
        placeholder="Filtrar por ID, nombre o apellido"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="order-filter-input"
      />
      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{getUserName(o.userId)}</td>
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
    </div>
  );
}