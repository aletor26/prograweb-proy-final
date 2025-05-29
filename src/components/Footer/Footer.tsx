import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer (){
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Cheers!</h3>
          <p>Tu tienda de licores de confianza</p>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>
            Email: <a href="mailto:Cheers@licoreria.com">Cheers@licoreria.com</a>
          </p>
          <p>Teléfono: (01) 123-4567</p>
        </div>
        <div className="footer-section">
          <h4>Páginas</h4>
          <p>
            <Link to="/">Inicio</Link>
          </p>
          <p>
            <Link to="/productos">Productos</Link>
          </p>
          <p>
            <Link to="/carrito">Carrito</Link>
          </p>
          <p>
            <Link to="/checkout">Checkout</Link>
          </p>
        </div>
        <div className="footer-section">
          <h4>Hot sale!</h4>
          <p>
            <Link to="/ofertas">Ofertas</Link>
          </p>
          <p>
            <Link to="/saved-items">Artículos guardados</Link>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Licorería Online. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}