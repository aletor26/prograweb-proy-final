import React from "react";
import { Link } from "react-router-dom";
import './UserOrdersList.css';

interface UserOrdersListProps {
  orders: any[];
}

const UserOrdersList: React.FC<UserOrdersListProps> = ({ orders }) => {
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
              <td>{order.numero || order.id}</td>
              <td>{new Date(order.fecha_pedido || order.fecha || order.createdAt).toLocaleDateString()}</td>
              <td className={`order-status-${order.estadoNombre || order.Estado_Pedido?.nombre || order.estado || order.estadoPedidoId}`}>
                {order.estadoNombre || order.Estado_Pedido?.nombre || order.estado || order.estadoPedidoId}
              </td>
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
