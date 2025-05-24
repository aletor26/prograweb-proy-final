import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de búsqueda
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          LicorStore
        </Link>
        
        <div className="navbar-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos, marcas o categorías..."
            />
          </form>
        </div>

        <div className="navbar-links">
          <Link to="/cart" className="navbar-link">
            Carrito
          </Link>
          <Link to="/login" className="navbar-link">
            Mi Cuenta
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 