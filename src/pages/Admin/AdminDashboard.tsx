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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario es admin
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    // Inicializar categorías si no existen
    const storedCategories = localStorage.getItem('categories');
    if (!storedCategories) {
      localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
    }

    setIsLoading(false);
  }, [user, navigate]);

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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 