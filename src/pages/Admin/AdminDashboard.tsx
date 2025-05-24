import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingDetails: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    phone: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

const DEFAULT_CATEGORIES = [
  {
    id: 'vinos',
    name: 'Vinos',
    description: 'Vinos tintos, blancos y rosados',
    active: true
  },
  {
    id: 'piscos',
    name: 'Piscos',
    description: 'Piscos puros y acholados',
    active: true
  },
  {
    id: 'whiskies',
    name: 'Whiskies',
    description: 'Whiskies de diferentes regiones',
    active: true
  },
  {
    id: 'vodkas',
    name: 'Vodkas',
    description: 'Vodkas premium',
    active: true
  },
  {
    id: 'tequilas',
    name: 'Tequilas',
    description: 'Tequilas blancos y reposados',
    active: true
  },
  {
    id: 'rones',
    name: 'Rones',
    description: 'Rones añejos y blancos',
    active: true
  },
  {
    id: 'gin',
    name: 'Gin',
    description: 'Ginebras premium',
    active: true
  },
  {
    id: 'champagnes',
    name: 'Champagnes',
    description: 'Champagnes y espumantes',
    active: true
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'categories'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario es admin
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    // Cargar órdenes
    const loadOrders = () => {
      const allOrders: Order[] = [];
      const users = localStorage.getItem('users');
      if (users) {
        JSON.parse(users).forEach((user: any) => {
          const userOrders = localStorage.getItem(`orders_${user.email}`);
          if (userOrders) {
            allOrders.push(...JSON.parse(userOrders));
          }
        });
      }
      setOrders(allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    // Cargar categorías
    const loadCategories = () => {
      const storedCategories = localStorage.getItem('categories');
      if (!storedCategories) {
        localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
        setCategories(DEFAULT_CATEGORIES);
      } else {
        setCategories(JSON.parse(storedCategories));
      }
    };

    loadOrders();
    loadCategories();
    setIsLoading(false);
  }, [user, navigate]);

  const updateOrderStatus = (orderId: string, userEmail: string, newStatus: Order['status']) => {
    const userOrders = localStorage.getItem(`orders_${userEmail}`);
    if (userOrders) {
      const updatedOrders = JSON.parse(userOrders).map((order: Order) => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      localStorage.setItem(`orders_${userEmail}`, JSON.stringify(updatedOrders));
      
      // Actualizar estado local
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    }
  };

  const updateCategoryStatus = (categoryId: string, active: boolean) => {
    const updatedCategories = categories.map(category => 
      category.id === categoryId ? { ...category, active } : category
    );
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'En proceso';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
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
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Gestión de Pedidos
          </button>
          <button
            className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Gestión de Categorías
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="orders-section">
          <h2>Pedidos Recientes</h2>
          <div className="orders-list">
            {orders.length === 0 ? (
              <p className="no-data">No hay pedidos registrados</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Pedido #{order.id}</h3>
                      <p className="order-date">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="order-status">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(
                          order.id,
                          order.shippingDetails.email,
                          e.target.value as Order['status']
                        )}
                        className={`status-select ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">En proceso</option>
                        <option value="completed">Completado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </div>
                  <div className="order-details">
                    <div className="customer-info">
                      <h4>Cliente</h4>
                      <p>{order.shippingDetails.fullName}</p>
                      <p>{order.shippingDetails.email}</p>
                      <p>{order.shippingDetails.phone}</p>
                    </div>
                    <div className="shipping-info">
                      <h4>Envío</h4>
                      <p>{order.shippingDetails.address}</p>
                      <p>{order.shippingDetails.city}</p>
                    </div>
                    <div className="order-summary">
                      <h4>Resumen</h4>
                      <p>{order.items.length} productos</p>
                      <p className="order-total">Total: S/ {order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="categories-section">
          <h2>Categorías de Productos</h2>
          <div className="categories-list">
            {categories.map(category => (
              <div key={category.id} className="category-card">
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
                <div className="category-actions">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={category.active}
                      onChange={(e) => updateCategoryStatus(category.id, e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="status-text">
                    {category.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 