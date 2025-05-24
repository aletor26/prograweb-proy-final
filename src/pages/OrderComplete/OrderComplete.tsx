import { useNavigate } from 'react-router-dom';
import './OrderComplete.css';

const OrderComplete = () => {
  const navigate = useNavigate();

  return (
    <div className="order-complete-container">
      <div className="order-complete-card">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h1 className="order-complete-title">¡Pedido Completado!</h1>
        <p className="order-complete-message">
          Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
        </p>
        <div className="order-info">
          <p>Te enviaremos un correo electrónico con los detalles de tu pedido y el número de seguimiento.</p>
          <p>El tiempo estimado de entrega es de {Math.floor(Math.random() * 3) + 3} días hábiles.</p>
        </div>
        <div className="order-complete-actions">
          <button 
            onClick={() => navigate('/')} 
            className="continue-shopping-button"
          >
            Continuar comprando
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderComplete;