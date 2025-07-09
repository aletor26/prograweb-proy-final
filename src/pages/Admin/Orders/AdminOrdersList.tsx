import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getPedidosAdmin } from "../../../services/pedidosservicio";
import './AdminOrdersList.css';
import Paginacion from '../../../components/Paginacion/Paginacion';
import OrderFilter from '../../../components/Orders/OrderFilter';

const AdminOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]); // Todos los pedidos sin filtrar
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'id' | 'nombre' | 'apellido'>('id');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // 10 pedidos por página en el frontend
  const [backendLimit] = useState(1000); // Cargar muchos pedidos del backend

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      
      params.page = 1; // Siempre cargar desde la página 1
      params.limit = backendLimit; // Cargar muchos pedidos

      const response = await getPedidosAdmin(params);
      const fetchedOrders = response.pedidos || [];
      setAllOrders(fetchedOrders);
      // No usar count del backend, calcular basado en pedidos filtrados
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar órdenes usando useMemo para evitar recálculos innecesarios
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return allOrders;
    
    return allOrders.filter((order: any) => {
      const clienteNombre = order.cliente?.nombre || '';
      const clienteApellido = order.cliente?.apellido || '';
      const orderId = order.id?.toString() || '';
      const searchLower = searchTerm.toLowerCase();
      
      if (searchField === 'id') {
        return orderId.includes(searchLower);
      } else if (searchField === 'nombre') {
        return clienteNombre.toLowerCase().includes(searchLower);
      } else if (searchField === 'apellido') {
        return clienteApellido.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }, [allOrders, searchTerm, searchField]);

  // Calcular pedidos paginados
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, limit]);

  // Actualizar orders cuando cambien los filtros
  useEffect(() => {
    setOrders(paginatedOrders);
    // Recalcular paginación basada en pedidos filtrados
    const newTotalPages = Math.max(1, Math.ceil(filteredOrders.length / limit));
    setTotalPages(newTotalPages);
    
    // Si la página actual es mayor que el nuevo total, resetear a página 1
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [paginatedOrders, filteredOrders, currentPage, limit]);

  useEffect(() => {
    fetchOrders();
    setCurrentPage(1);
  }, []); // Solo cargar una vez al montar el componente

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchOrders();
  };

  const handleSearch = () => {
    // No hacer nada, el filtrado ya es automático
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
      <OrderFilter
        searchTerm={searchTerm}
        searchField={searchField}
        onSearchTermChange={setSearchTerm}
        onSearchFieldChange={setSearchField}
        onSearch={handleSearch}
      />
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