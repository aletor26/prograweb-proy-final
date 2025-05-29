import React from "react";
import { Link } from "react-router-dom";

interface OrderRowProps {
  order: any;
}

const OrderRow: React.FC<OrderRowProps> = ({ order }) => (
  <tr>
    <td>{order.id}</td>
    <td>{order.nombre}</td>
    <td>{order.apellido}</td>
    <td>{order.status}</td>
    <td>
      <Link to={`/admin/orders/${order.id}`}>Ver detalles</Link>
    </td>
  </tr>
);

export default OrderRow;
