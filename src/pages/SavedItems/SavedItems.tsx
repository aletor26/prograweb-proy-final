import { useCart } from '../../context/CartContext';
import './SavedItems.css';

const SavedItems = () => {
  const { savedItems, moveToCart, removeSavedItem } = useCart();

  return (
    <div className="saved-items-container">
      <h1 className="saved-items-title">Items Guardados</h1>
      
      <div className="saved-items-grid">
        {savedItems.map(item => (
          <div key={item.id} className="saved-item-card">
            
            <img src={item.image} alt={item.name} className="saved-item-image" />
            <div className="saved-item-details">
              <h3 className="saved-item-name">{item.name}</h3>
              <p className="saved-item-category">{item.category}</p>
              <p className="saved-item-price">S/ {item.price.toFixed(2)}</p>
              <div className="saved-item-actions">
                <button
                  onClick={() => moveToCart(item.id)}
                  className="move-to-cart-button"
                >
                  Mover al carrito
                </button>
                <button
                  onClick={() => removeSavedItem(item.id)}
                  className="remove-saved-item"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}

        {savedItems.length === 0 && (
          <p className="no-saved-items">No tienes items guardados</p>
        )}
      </div>
    </div>
  );
};

export default SavedItems; 