import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAdmin = user?.role === 'admin';

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

  const categories = [
    'Vinos',
    'Piscos',
    'Whiskies',
    'Vodkas',
    'Tequilas',
    'Rones',
    'Gin',
    'Champagnes'
  ];

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
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  className="category-item"
                  onClick={() => setShowCategories(false)}
                >
                  {category}
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
                      <Link to="/admin" className="menu-item admin-link">
                        <i className="fas fa-home"></i>
                         Panel Principal
                      </Link>
                      <Link to="/admin/users" className="menu-item admin-link">
                        <i className="fas fa-box"></i>
                        Usuarios
                      </Link>
                      <Link to="/admin/orders" className="menu-item admin-link">
                        <i className="fas fa-tasks"></i>
                        Gestión de Pedidos
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