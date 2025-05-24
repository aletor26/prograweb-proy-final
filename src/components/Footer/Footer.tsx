import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Licorería Online</h3>
          <p>Tu tienda de licores de confianza</p>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Email: contacto@licoreria.com</p>
          <p>Teléfono: (01) 123-4567</p>
        </div>
        <div className="footer-section">
          <h4>Horario</h4>
          <p>Lunes a Sábado: 10:00 - 22:00</p>
          <p>Domingo: 10:00 - 20:00</p>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <p>Términos y condiciones</p>
          <p>Política de privacidad</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Licorería Online. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer; 