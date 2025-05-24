import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PeriodForm from '../../components/PeriodForm';
import SummaryCards from '../../components/SummaryCards';
import ProductList from '../../components/ProductList/ProductList';
import './AdminHome.css';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: any[];
  shippingDetails: any;
}

interface User {
  name: string;
  email: string;
  createdAt: string;
  role: string;
}

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().slice(0, 10);
};

const AdminHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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

    // Cargar usuarios
    const usersData = localStorage.getItem('users');
    let usersList: User[] = [];
    if (usersData) {
      usersList = JSON.parse(usersData);
      setUsers(usersList);
    }

    // Cargar órdenes
    let allOrders: Order[] = [];
    if (usersData) {
      JSON.parse(usersData).forEach((u: any) => {
        const userOrders = localStorage.getItem(`orders_${u.email}`);
        if (userOrders) {
          allOrders.push(...JSON.parse(userOrders));
        }
      });
    }
    setOrders(allOrders);
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
      .reduce((sum, order) => sum + order.total, 0);

    setSummary({
      totalOrders: filteredOrders.length,
      newUsers: filteredUsers.length,
      totalIncome,
    });
  }, [orders, users, startDate, endDate]);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Resumen del Administrador</h1>
      </div>
      <PeriodForm
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <SummaryCards
        totalOrders={summary.totalOrders}
        newUsers={summary.newUsers}
        totalIncome={summary.totalIncome}
      />
      <ProductList />
    </div>
  );
};

export default AdminHome;