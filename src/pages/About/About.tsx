import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>Sobre Nosotros</h1>
        
        <section className="about-section">
          <h2>Nuestra Historia</h2>
          <p>
            Mi-Tiendita nació con la visión de ofrecer la mejor selección de licores
            y bebidas premium a nuestros clientes. Desde nuestro inicio, nos hemos
            comprometido a brindar productos de alta calidad y un servicio excepcional.
          </p>
        </section>

        <section className="about-section">
          <h2>Nuestra Misión</h2>
          <p>
            Nos dedicamos a proporcionar una experiencia de compra única,
            ofreciendo una cuidadosa selección de bebidas de calidad premium
            y un servicio personalizado que supere las expectativas de
            nuestros clientes.
          </p>
        </section>

        <section className="about-section">
          <h2>¿Por qué elegirnos?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-check-circle"></i>
              <h3>Calidad Garantizada</h3>
              <p>Todos nuestros productos son 100% originales y de la mejor calidad.</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-truck"></i>
              <h3>Envío Rápido</h3>
              <p>Entrega a domicilio en menos de 24 horas.</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-heart"></i>
              <h3>Atención Personalizada</h3>
              <p>Asesoramiento experto para todas tus consultas.</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Compra Segura</h3>
              <p>Transacciones seguras y protegidas.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Contáctanos</h2>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <p>Av. Principal 123, Lima</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <p>+51 123 456 789</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <p>contacto@mitiendita.com</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 