import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './AdminOrdersList.css';

const AdminOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'id' | 'nombre' | 'apellido'>('id');

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
    order[searchField]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-orders-section">
      <h2>Listado de Órdenes</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <select
          value={searchField}
          onChange={e => setSearchField(e.target.value as 'id' | 'nombre' | 'apellido')}
          className="admin-search-input"
          style={{ maxWidth: 120 }}
        >
          <option value="id">ID</option>
          <option value="nombre">Nombre</option>
          <option value="apellido">Apellido</option>
        </select>
        <input
          type="text"
          placeholder={`Buscar por ${searchField}`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="admin-search-input"
          style={{ flex: 1 }}
        />
      </div>
      {filteredOrders.length === 0 ? (
        <div className="admin-orders-no-orders">No hay órdenes registradas</div>
      ) : (
        <div className="admin-orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="admin-order-card">
              <div className="admin-order-info">
                <div className="admin-order-id">ID: {order.id}</div>
                <div>Nombre: {order.nombre}</div>
                <div>Apellido: {order.apellido}</div>
                <div
                  className={
                    "admin-order-status " +
                    (order.status === "completed"
                      ? "estado-completado"
                      : order.status === "pending"
                      ? "estado-pendiente"
                      : order.status === "processing"
                      ? "estado-processing"
                      : "estado-cancelado")
                  }
                >
                  Estado: {order.status}
                </div>
              </div>
              <div className="admin-order-actions">
                <Link to={`/admin/orders/${order.id}`} className="admin-order-action-button">
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersList;
