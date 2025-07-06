import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getUsuariosAdmin } from '../../../services/usuarioservicio';
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

  // Estadísticas
  const [summary, setSummary] = useState({
    totalOrders: 0,
    newUsers: 0,
    totalIncome: 0,
  });

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
        const parsedUsers: User[] = usersResponse.rows || usersResponse || [];
        setUsers(parsedUsers);

        // Órdenes: intenta primero global, si no, por usuario
        let allOrders: Order[] = [];
        const globalOrders = localStorage.getItem('orders');
        if (globalOrders) {
          allOrders = JSON.parse(globalOrders);
        } else if (parsedUsers.length > 0) {
          parsedUsers.forEach((u) => {
            const userOrders = localStorage.getItem(`orders_${u.email}`);
            if (userOrders) {
              allOrders.push(...JSON.parse(userOrders));
            }
          });
        }
        setOrders(allOrders);
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
    window.addEventListener('storage', loadUsersAndOrders);
    return () => {
      window.removeEventListener('storage', loadUsersAndOrders);
    };
  }, [user, navigate]);

  useEffect(() => {
    // Filtrar por periodo
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Filtrar órdenes
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= start && orderDate <= end;
    });

    // Filtrar usuarios nuevos
    const filteredUsers = users.filter(u => {
      const created = new Date(u.createdAt);
      return created >= start && created <= end;
    });

    // Calcular ingresos
    const totalIncome = filteredOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.total || 0), 0);

    setSummary({
      totalOrders: filteredOrders.length,
      newUsers: filteredUsers.length,
      totalIncome,
    });
  }, [orders, users, startDate, endDate]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === user?.id) {
      alert('No puedes eliminar tu propio usuario administrador');
      return;
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const updatedUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

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
      />

      <div className="users-section">
        <UserList />
      </div>
    </div>
  );
};

export default AdminUsers;