import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>Sobre Nosotros</h3>
            <ul className="footer-links">
              <li><Link to="/about" className="footer-link">Quiénes Somos</Link></li>
              <li><Link to="/contact" className="footer-link">Contacto</Link></li>
              <li><Link to="/locations" className="footer-link">Ubicaciones</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Categorías</h3>
            <ul className="footer-links">
              <li><Link to="/category/vinos" className="footer-link">Vinos</Link></li>
              <li><Link to="/category/piscos" className="footer-link">Piscos</Link></li>
              <li><Link to="/category/rones" className="footer-link">Rones</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Ayuda</h3>
            <ul className="footer-links">
              <li><Link to="/faq" className="footer-link">Preguntas Frecuentes</Link></li>
              <li><Link to="/shipping" className="footer-link">Envíos</Link></li>
              <li><Link to="/returns" className="footer-link">Devoluciones</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><Link to="/terms" className="footer-link">Términos y Condiciones</Link></li>
              <li><Link to="/privacy" className="footer-link">Política de Privacidad</Link></li>
              <li><Link to="/cookies" className="footer-link">Política de Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LicorStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 