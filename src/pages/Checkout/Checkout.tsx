import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { completarOrden } from '../../services/clienteservicios'; // Ajusta la ruta real

import QRCode from 'react-qr-code';
import './Checkout.css';

interface ShippingAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
}

interface CreditCard {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: cartItems, clearCart } = useCart();
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    email: user?.email || '',
    address: '',
    city: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'credit-card'>('qr');
  const [creditCard, setCreditCard] = useState<CreditCard>({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'standard' ? 15 : 25;
  const total = subtotal + shippingCost;

  // Generar datos para el código QR
  const generateQRData = () => {
    const orderData = {
      orderId: Date.now(),
      total: total,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      customer: shippingAddress.email,
      date: new Date().toISOString()
    };
    return JSON.stringify(orderData);
  };

  const handleShippingSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreditCardSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreditCard(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = () => {
    const isShippingValid = Object.values(shippingAddress).every(value => value.length > 0);
    const isPaymentValid = paymentMethod === 'qr' || 
      (paymentMethod === 'credit-card' && Object.values(creditCard).every(value => value.length > 0));
    return isShippingValid && isPaymentValid;
  };

 const handleCompleteOrder = async () => {
  if (!isFormValid() || !user?.id) return;

  try {
    const data = {
      metodoPago: paymentMethod,
      datosPago: paymentMethod === 'credit-card' ? creditCard : {}, // si usas QR, se envía vacío
      metodoEnvioId: shippingMethod === 'express' ? 2 : 1, // Asegúrate que estos IDs existan
      correo: shippingAddress.email,
      clienteId: user.id,
      subtotal: subtotal,
      items: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      shippingDetails: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone
      }
    };

    const respuesta = await completarOrden(data);
    console.log('Orden completada:', respuesta);

    clearCart();
    navigate('/order-complete');
  } catch (error) {
    console.error('Error al completar la orden:', error);
    alert('Hubo un error al procesar tu pedido.');
  }
};
  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-empty">
          <h2>Tu carrito está vacío</h2>
          <button onClick={() => navigate('/')} className="continue-shopping">
            Continuar comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        {/* Dirección de envío */}
        <div className="checkout-section">
          <h2 className="checkout-section-title">Dirección de envío</h2>
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleShippingSubmit}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={shippingAddress.email}
              onChange={handleShippingSubmit}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              name="address"
              value={shippingAddress.address}
              onChange={handleShippingSubmit}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Ciudad</label>
            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              onChange={handleShippingSubmit}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleShippingSubmit}
              className="form-input"
            />
          </div>
        </div>

        {/* Método de envío */}
        <div className="checkout-section">
          <h2 className="checkout-section-title">Método de envío</h2>
          <div className="shipping-methods">
            <div
              className={`shipping-method ${shippingMethod === 'standard' ? 'selected' : ''}`}
              onClick={() => setShippingMethod('standard')}
            >
              <div>
                <strong>Envío estándar</strong>
                <p>3-5 días hábiles</p>
              </div>
              <span className="shipping-method-price">S/ 15.00</span>
            </div>
            <div
              className={`shipping-method ${shippingMethod === 'express' ? 'selected' : ''}`}
              onClick={() => setShippingMethod('express')}
            >
              <div>
                <strong>Envío express</strong>
                <p>1-2 días hábiles</p>
              </div>
              <span className="shipping-method-price">S/ 25.00</span>
            </div>
          </div>
        </div>

        {/* Método de pago */}
        <div className="checkout-section">
          <h2 className="checkout-section-title">Método de pago</h2>
          <div className="payment-methods">
            <div
              className={`payment-method ${paymentMethod === 'qr' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('qr')}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'qr'}
                onChange={() => setPaymentMethod('qr')}
              />
              <span>Pago con código QR</span>
            </div>
            <div
              className={`payment-method ${paymentMethod === 'credit-card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('credit-card')}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'credit-card'}
                onChange={() => setPaymentMethod('credit-card')}
              />
              <span>Tarjeta de crédito</span>
            </div>
          </div>

          {paymentMethod === 'qr' && (
            <div className="qr-code">
              <QRCode
                value={generateQRData()}
                size={200}
                level="H"
                className="qr-code-image"
              />
              <p>Escanea el código QR para realizar el pago</p>
              <small className="qr-total">Total a pagar: S/. {total.toFixed(2)}</small>
            </div>
          )}

          {paymentMethod === 'credit-card' && (
            <div className="credit-card-form">
              <div className="form-group">
                <label className="form-label">Número de tarjeta</label>
                <input
                  type="text"
                  name="number"
                  value={creditCard.number}
                  onChange={handleCreditCardSubmit}
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre en la tarjeta</label>
                <input
                  type="text"
                  name="name"
                  value={creditCard.name}
                  onChange={handleCreditCardSubmit}
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fecha de expiración</label>
                  <input
                    type="text"
                    name="expiry"
                    value={creditCard.expiry}
                    onChange={handleCreditCardSubmit}
                    className="form-input"
                    placeholder="MM/AA"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={creditCard.cvv}
                    onChange={handleCreditCardSubmit}
                    className="form-input"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="order-summary">
        <h2 className="order-summary-title">Resumen del pedido</h2>
        <div className="order-items">
          {cartItems.map(item => (
            <div key={item.id} className="order-item">
              <img src={item.image} alt={item.name} className="order-item-image" />
              <div className="order-item-details">
                <p className="order-item-name">{item.name}</p>
                <p className="order-item-price">
                  {item.quantity} x S/ {item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="order-summary-row">
          <span>Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <div className="order-summary-row">
          <span>Envío</span>
          <span>S/ {shippingCost.toFixed(2)}</span>
        </div>
        <div className="order-summary-row order-total">
          <span>Total</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCompleteOrder}
          className="complete-order-button"
          disabled={!isFormValid()}
        >
          Completar pedido
        </button>
      </div>
    </div>
  );
};

export default Checkout; 