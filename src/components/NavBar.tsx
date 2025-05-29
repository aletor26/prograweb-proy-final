import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './NavBar.css';
import BotonCerrarSesion from './BotonCerrarSesion/BotonCerrarSesion';

interface Category {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

const NavBar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { items, savedItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState<Category[] | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const loadCategories = () => {
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        setCategories(parsedCategories.filter((cat: Category) => cat.active));
      } else {
        setCategories(null);
      }
    };

    loadCategories();
    window.addEventListener('storage', loadCategories);
    return () => {
      window.removeEventListener('storage', loadCategories);
    };
  }, []);

  const fallbackCategories = [
    'Vinos', 'Piscos', 'Whiskies', 'Vodkas', 'Tequilas', 'Rones', 'Gin', 'Champagnes'
  ];

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
        <Link to="/" className="brand-logo">Cheers!</Link>
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
              {(categories ?? fallbackCategories).map((cat: any) => (
                <Link
                  key={cat.id ?? cat}
                  to={`/category/${(cat.name ?? cat).toLowerCase()}`}
                  className="category-item"
                  onClick={() => setShowCategories(false)}
                >
                  {cat.name ?? cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link to="/productos" className="menu-link">Productos</Link>
        <Link to="/ofertas" className="menu-link highlight">OFERTAS</Link>

        {isAuthenticated ? (
          <div className="nav-user-section">
            {/* Carrito: solo para clientes o usuarios no loggeados */}
            {(!isAuthenticated || !isAdmin) && (
              <Link to="/cart" className="cart-link">
                <img
                  src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/solid/shopping-bag.svg"
                  alt="Carrito"
                  className="nav-icon"
                />
                {items.length > 0 && (
                  <span className="cart-count">{items.length}</span>
                )}
              </Link>
            )}

            {/* Favoritos solo si está loggeado y no es admin */}
            {isAuthenticated && !isAdmin && (
              <Link to="/saved-items" className="saved-items-link">
                <img
                  src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/regular/heart.svg"
                  alt="Favoritos"
                  className="nav-icon"
                />
                {savedItems.length > 0 && (
                  <span className="saved-items-count">{savedItems.length}</span>
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
                    <i className="fa fa-user-shield"></i>
                    <span>Admin</span>
                  </div>
                ) : (
                  <div className="user-profile">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/6522/6522581.png"
                      alt="Usuario"
                      className="nav-icon"
                    />
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
                        <i className="fas fa-user-circle"></i> Mi Perfil
                      </Link>
                      <Link to="/orders" className="menu-item">
                        <i className="fas fa-box"></i> Mis Pedidos
                      </Link>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <Link to="/admin/orders" className="menu-item admin-link">
                        <i className="fas fa-tasks"></i> Gestión de Pedidos
                      </Link>
                      <Link to="/admin/categories" className="menu-item admin-link">
                        <i className="fas fa-tags"></i> Gestión de Categorías
                      </Link>
                      <Link to="/admin/products" className="menu-item admin-link">
                        <i className="fas fa-wine-bottle"></i> Gestión de Productos
                      </Link>
                      <Link to="/admin/users" className="menu-item admin-link">
                        <i className="fas fa-users"></i> Gestión de Usuarios
                      </Link>
                    </>
                  )}

                   <BotonCerrarSesion
                    onClick={handleLogout}
                    className="menu-item logout-button"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-button">Iniciar sesión</Link>
            <Link to="/register" className="register-button">Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
