import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPedidosAdmin } from "../../../services/pedidosservicio";
import './AdminOrdersList.css';
import Paginacion from '../../../components/Paginacion/Paginacion';

const AdminOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'id' | 'nombre' | 'apellido'>('id');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // 10 pedidos por página

  const fetchOrders = async (page: number) => {
    try {
      setIsLoading(true);
      const params: any = {};
      
      if (searchTerm) {
        if (searchField === 'id') {
          params.id = searchTerm;
        } else if (searchField === 'nombre') {
          params.nombre = searchTerm;
        } else if (searchField === 'apellido') {
          params.apellido = searchTerm;
        }
      }
      params.page = page;
      params.limit = limit;

      const response = await getPedidosAdmin(params);
      setOrders(response.pedidos || []);
      const count = response.count || (response.pedidos ? response.pedidos.length : 0);
      setTotalPages(Math.max(1, Math.ceil(count / limit)));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
    setCurrentPage(1);
  }, [searchTerm, searchField]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchOrders(page);
  };

  const handleSearch = () => {
    fetchOrders(1);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="admin-orders-section">
        <p>Cargando órdenes...</p>
      </div>
    );
  }

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
        <button onClick={handleSearch} className="admin-search-button">
          Buscar
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="admin-orders-no-orders">No hay órdenes registradas</div>
      ) : (
        <div className="admin-orders-list">
          {orders.map(order => (
            <div key={order.id} className="admin-order-card">
              <div className="admin-order-info">
                <div className="admin-order-id">ID: {order.id}</div>
                <div>Nombre: {order.cliente?.nombre || 'N/A'}</div>
                <div>Apellido: {order.cliente?.apellido || 'N/A'}</div>
                <div
                  className={
                    "admin-order-status " +
                    (order.estadoNombre === 'Pendiente'
                      ? "estado-pendiente"
                      : order.estadoNombre === 'Procesando'
                      ? "estado-processing"
                      : order.estadoNombre === 'Completado'
                      ? "estado-completado"
                      : order.estadoNombre === 'Cancelado'
                      ? "estado-cancelado"
                      : "")
                  }
                >
                  Estado: {order.estadoNombre || 'Desconocido'}
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
      <Paginacion
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminOrdersList;