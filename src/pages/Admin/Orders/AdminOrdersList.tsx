import React, { useEffect, useState } from "react";
import OrderFilter from "../../../components/Orders/OrderFilter";
import OrderRow from "../../../components/Orders/OrderRow";
import { Link } from "react-router-dom";

const AdminOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filters, setFilters] = useState({ id: "", nombre: "", apellido: "" });

  useEffect(() => {
    // Cargar todos los usuarios
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    let allOrders: any[] = [];
    users.forEach((u: any) => {
      const userOrders = localStorage.getItem(`orders_${u.email}`);
      if (userOrders) {
        const parsedOrders = JSON.parse(userOrders).map((order: any) => ({
          ...order,
          nombre: u.nombre || u.name?.split(" ")[0] || "",
          apellido: u.apellido || u.name?.split(" ").slice(1).join(" ") || "",
        }));
        allOrders = allOrders.concat(parsedOrders);
      }
    });
    setOrders(allOrders);
  }, []);

  const filteredOrders = orders.filter(order =>
    order.id.includes(filters.id) &&
    order.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) &&
    order.apellido.toLowerCase().includes(filters.apellido.toLowerCase())
  );

  return (
    <div>
      <h2>Listado de Órdenes</h2>
      <OrderFilter filters={filters} onChange={setFilters} />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Estado</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <OrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersList;
