import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { items: cartItems, updateQuantity, removeFromCart: removeItem, moveToSaved } = useCart();

  const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const shipping = 15.00;
  const orderTotal = subtotal + shipping;

  const handleQuantityChange = (itemId: number, value: string) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(itemId, quantity);
    }
  };

  const renderCartItem = (item: CartItem) => (
    <div key={item.id} className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <div>
          <h3 className="cart-item-name">{item.name}</h3>
          <p className="cart-item-category">{item.category}</p>
          <p className="cart-item-price" aria-label={`Precio: S/ ${item.price.toFixed(2)}`}>
            S/ {item.price.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="cart-item-actions">
        <input
          type="number"
          min="1"
          value={item.quantity.toString()}
          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
          className="cart-item-quantity"
          aria-label={`Cantidad de ${item.name}`}
        />
        <button
          onClick={() => moveToSaved(item.id)}
          className="cart-item-save"
          aria-label={`Guardar ${item.name} para después`}
        >
          Guardar
        </button>
        <button
          onClick={() => removeItem(item.id)}
          className="cart-item-remove"
          aria-label={`Eliminar ${item.name} del carrito`}
        >
          Eliminar
        </button>
      </div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-items">
          <h1 className="cart-title">Carrito de Compras</h1>
          <div className="cart-empty">
            <p className="cart-empty-message">No hay productos en el carrito</p>
            <Link to="/" className="cart-empty-button">
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-items">
        <h1 className="cart-title">Carrito de Compras</h1>
        {cartItems.map(item => renderCartItem(item))}
      </div>

      <div className="cart-summary" role="complementary" aria-label="Resumen del pedido">
        <h2 className="cart-summary-title">Resumen del pedido</h2>
        {cartItems.map(item => (
          <div key={item.id} className="cart-summary-row">
            <span>{item.name} ({item.quantity}x)</span>
            <span aria-label={`Subtotal: S/ ${(item.price * item.quantity).toFixed(2)}`}>
              S/ {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span aria-label={`Subtotal: S/ ${subtotal.toFixed(2)}`}>
            S/ {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="cart-summary-row">
          <span>Envío</span>
          <span aria-label={`Costo de envío: S/ ${shipping.toFixed(2)}`}>
            S/ {shipping.toFixed(2)}
          </span>
        </div>
        <div className="cart-summary-row cart-summary-total">
          <span>Total</span>
          <span aria-label={`Total a pagar: S/ ${orderTotal.toFixed(2)}`}>
            S/ {orderTotal.toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="checkout-button"
          disabled={cartItems.length === 0}
          aria-label="Proceder al pago"
        >
          Proceder al pago
        </button>
      </div>
    </div>
  );
};

export default Cart; 