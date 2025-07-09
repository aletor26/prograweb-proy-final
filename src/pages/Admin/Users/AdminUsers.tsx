import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getUsuariosAdmin } from '../../../services/usuarioservicio';
import { getPedidosAdmin } from '../../../services/pedidosservicio';
import SummaryCards from '../../../components/SummaryCards/SummaryCards';
import PeriodForm from '../../../components/PeriodForm/PeriodForm';
import UserList from '../../../components/UserList/UserList';
import './AdminUsers.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  dni?: string;
  password?: string;
  activo: boolean;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  // ...otros campos si los tienes
}

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().slice(0, 10);
};

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Para filtrar por periodo
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Estadísticas
  const [summary, setSummary] = useState({
    totalOrders: 0,
    newUsers: 0,
    totalIncome: 0,
  });

  // Función para cargar estadísticas por período
  const loadStatsByPeriod = async (start: string, end: string) => {
    try {
      setIsLoadingStats(true);
      
      // Filtrar por periodo
      const startDate = new Date(start);
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);

      // Filtrar órdenes por fecha
      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startDate && orderDate <= endDate;
      });

      // Filtrar usuarios nuevos por fecha de creación
      const filteredUsers = users.filter(u => {
        const created = new Date(u.createdAt);
        return created >= startDate && created <= endDate;
      });

      // Calcular ingresos (solo pedidos completados)
      const totalIncome = filteredOrders
        .filter(order => order.status === 'Completado' || order.status === 'completed')
        .reduce((sum, order) => sum + (order.total || 0), 0);

      setSummary({
        totalOrders: filteredOrders.length,
        newUsers: filteredUsers.length,
        totalIncome,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const loadUsersAndOrders = async () => {
      try {
        setIsLoading(true);
        
        // Cargar usuarios del backend
        const usersResponse = await getUsuariosAdmin();
        
        // El backend devuelve { count: number, rows: User[] }
        // donde cada User tiene { Estado: { id: number, nombre: string } }
        const users = usersResponse.rows || usersResponse || [];
        
        // Transformar los datos para que sean compatibles con el componente
        const transformedUsers: User[] = users.map((user: any) => ({
          ...user,
          // Mapear campos del backend a los que espera el componente
          email: user.correo,
          name: user.nombre,
          activo: user.Estado?.nombre === 'Activo' || user.estadoid === 1,
          role: user.role || 'customer', // Por defecto customer si no existe
          createdAt: user.createdAt
        }));
        
        setUsers(transformedUsers);

        // Cargar pedidos del backend
        const ordersResponse = await getPedidosAdmin({ limit: 1000 }); // Obtener todos los pedidos
        const allOrders = ordersResponse.pedidos || [];
        
        // Transformar pedidos al formato esperado
        const transformedOrders: Order[] = allOrders.map((order: any) => ({
          id: order.id,
          date: order.fecha_pedido || order.createdAt,
          total: order.precio_total || 0,
          status: order.estadoNombre || 'Pendiente'
        }));
        
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error al cargar usuarios u órdenes:', error);
        
        // Fallback a localStorage si hay error
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUsersAndOrders();
  }, [user, navigate]);

  useEffect(() => {
    // Cargar estadísticas cuando cambien las fechas o los datos
    if (orders.length > 0 || users.length > 0) {
      loadStatsByPeriod(startDate, endDate);
    }
  }, [orders, users, startDate, endDate]);

  if (isLoading) {
    return (
      <div className="admin-users">
        <div className="loading">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>Gestión de Usuarios</h1>
      </div>

      {/* Filtros de periodo */}
      <PeriodForm
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {/* Tarjetas resumen */}
      <SummaryCards
        totalOrders={summary.totalOrders}
        newUsers={summary.newUsers}
        totalIncome={summary.totalIncome}
        isLoading={isLoadingStats}
      />

      {/* Botón para cargar estadísticas totales */}
      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <button 
          onClick={() => {
            setStartDate('2020-01-01'); // Fecha muy antigua para obtener todos los datos
            setEndDate(new Date().toISOString().slice(0, 10)); // Hoy
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#c8a97e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ver Estadísticas Totales
        </button>
      </div>

      <div className="users-section">
        <UserList />
      </div>
    </div>
  );
};

export default AdminUsers;