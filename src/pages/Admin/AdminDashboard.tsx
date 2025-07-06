import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerEstadisticasDashboard } from '../../services/productoservicio';
import SummaryCards from '../../components/SummaryCards/SummaryCards';
import PeriodForm from '../../components/PeriodForm/PeriodForm';
import './AdminDashboard.css';

interface DashboardStats {
  totalOrders: number;
  newUsers: number;
  totalIncome: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    newUsers: 0,
    totalIncome: 0
  });

  // Fechas por defecto (hoy)
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    // Verificar si el usuario es admin
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchDashboardStats();
  }, [user, navigate, startDate, endDate]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const data = await obtenerEstadisticasDashboard(startDate, endDate);
      setStats({
        totalOrders: data.totalOrders || 0,
        newUsers: data.newUsers || 0,
        totalIncome: data.totalIncome || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // En caso de error, mostrar datos por defecto
      setStats({
        totalOrders: 0,
        newUsers: 0,
        totalIncome: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Cargando panel de administración...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Resumen de actividad del sistema</p>
      </div>

      <div className="admin-stats-section">
        <h2>Estadísticas del Período</h2>
        <PeriodForm
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <SummaryCards
          totalOrders={stats.totalOrders}
          newUsers={stats.newUsers}
          totalIncome={stats.totalIncome}
        />
      </div>

      <div className="admin-options">
        <button
          className="admin-option-button"
          onClick={() => navigate('/admin/orders')}
        >
          <i className="fas fa-shopping-cart"></i>
          Gestión de Pedidos
        </button>
        <button
          className="admin-option-button"
          onClick={() => navigate('/admin/categories')}
        >
          <i className="fas fa-tags"></i>
          Gestión de Categorías
        </button>
        <button
          className="admin-option-button"
          onClick={() => navigate('/admin/products')}
        >
          <i className="fas fa-wine-bottle"></i>
          Gestión de Productos
        </button>
        <button
          className="admin-option-button"
          onClick={() => navigate('/admin/users')}
        >
          <i className="fas fa-users"></i>
          Gestión de Usuarios
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard; 