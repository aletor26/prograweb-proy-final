import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './NavBar.css';

interface Category {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

const NavBar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const loadCategories = () => {
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        // Solo mostrar categorías activas
        setCategories(parsedCategories.filter((cat: Category) => cat.active));
      }
    };

    loadCategories();
    // Agregar un event listener para actualizar las categorías cuando cambien
    window.addEventListener('storage', loadCategories);
    
    return () => {
      window.removeEventListener('storage', loadCategories);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-logo">
          Cheers!
        </Link>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar productos..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </form>

      <div className="navbar-menu">
        <div className="categories-dropdown">
          <button 
            className="categories-button"
            onClick={() => setShowCategories(!showCategories)}
          >
            <i className="fas fa-bars"></i>
            <span>Categorías</span>
          </button>
          {showCategories && (
            <div className="categories-list">
              {categories.map((category) => (
                <Link 
                  key={category.id}
                  to={`/category/${category.name.toLowerCase()}`}
                  className="category-item"
                  onClick={() => setShowCategories(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link to="/productos" className="menu-link">Productos</Link>
        <Link to="/ofertas" className="menu-link highlight">OFERTAS</Link>

        {isAuthenticated ? (
          <div className="nav-user-section">
            {!isAdmin && (
              <Link to="/cart" className="cart-link">
                <i className="fas fa-shopping-cart"></i>
                {items.length > 0 && (
                  <span className="cart-count">{items.length}</span>
                )}
              </Link>
            )}

            <div className="user-menu-container">
              <button
                className="user-menu-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {isAdmin ? (
                  <div className="admin-profile">
                    <i className="fas fa-user-shield"></i>
                    <span>Admin</span>
                  </div>
                ) : (
                  <div className="user-profile">
                    <i className="fas fa-user"></i>
                    <span>{user?.name}</span>
                  </div>
                )}
              </button>

              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-info">
                    <p className="user-name">{isAdmin ? 'Administrador' : user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                  
                  {!isAdmin && (
                    <>
                      <Link to="/profile" className="menu-item">
                        <i className="fas fa-user-circle"></i>
                        Mi Perfil
                      </Link>
                      
                      <Link to="/orders" className="menu-item">
                        <i className="fas fa-box"></i>
                        Mis Pedidos
                      </Link>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <Link to="/admin/orders" className="menu-item admin-link">
                        <i className="fas fa-shopping-cart"></i>
                        Gestión de Pedidos
                      </Link>
                      <Link to="/admin/categories" className="menu-item admin-link">
                        <i className="fas fa-tags"></i>
                        Gestión de Categorías
                      </Link>
                      <Link to="/admin/products" className="menu-item admin-link">
                        <i className="fas fa-wine-bottle"></i>
                        Gestión de Productos
                      </Link>
                      <Link to="/admin/users" className="menu-item admin-link">
                        <i className="fas fa-users"></i>
                        Gestión de Usuarios
                      </Link>
                    </>
                  )}
                  
                  <button onClick={handleLogout} className="menu-item logout-button">
                    <i className="fas fa-sign-out-alt"></i>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-button">
              Iniciar sesión
            </Link>
            <Link to="/register" className="register-button">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar; 