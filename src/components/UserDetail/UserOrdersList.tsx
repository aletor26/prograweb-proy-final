import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './UserOrdersList.css';

interface UserOrdersListProps {
  email: string;
}

const UserOrdersList: React.FC<UserOrdersListProps> = ({ email }) => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const userOrders = localStorage.getItem(`orders_${email}`);
    if (userOrders) {
      const parsed = JSON.parse(userOrders);
      setOrders(parsed.slice(0, 10)); // Máximo 10
    }
  }, [email]);

  if (!orders.length) {
    return <p>Este usuario no tiene órdenes.</p>;
  }

  return (
    <div className="user-orders-list">
      <h3>Órdenes del usuario</h3>
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td className={`order-status-${order.status}`}>{order.status}</td>
              <td>
                <Link className="order-detail-link" to={`/admin/orders/${order.id}`}>Ver detalles</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserOrdersList;
