import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { items: cartItems, savedItems, updateQuantity, removeFromCart: removeItem, moveToSaved, moveToCart, removeSavedItem } = useCart();

  const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const shipping = 15.00;
  const orderTotal = subtotal + shipping;

  return (
    <div className="cart-container">
      <div className="cart-items">
        <h1 className="cart-title">Carrito de Compras</h1>
        
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <div>
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-category">{item.category}</p>
                <p className="cart-item-price">S/ {item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="cart-item-actions">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                className="cart-item-quantity"
              />
              <button
                onClick={() => moveToSaved(item.id)}
                className="cart-item-save"
              >
                Guardar
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="cart-item-remove"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        {cartItems.length === 0 && (
          <p>No hay productos en el carrito</p>
        )}

        {savedItems.length > 0 && (
          <div className="saved-items">
            <h2 className="saved-items-title">Guardados para después</h2>
            {savedItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <div>
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">S/ {item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <button
                    onClick={() => moveToCart(item.id)}
                    className="cart-item-save"
                  >
                    Mover al carrito
                  </button>
                  <button
                    onClick={() => removeSavedItem(item.id)}
                    className="cart-item-remove"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cart-summary">
        <h2 className="cart-summary-title">Resumen del pedido</h2>
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <div className="cart-summary-row">
          <span>Envío</span>
          <span>S/ {shipping.toFixed(2)}</span>
        </div>
        <div className="cart-summary-row cart-summary-total">
          <span>Total</span>
          <span>S/ {orderTotal.toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="checkout-button"
          disabled={cartItems.length === 0}
        >
          Proceder al pago
        </button>
      </div>
    </div>
  );
};

export default Cart; 