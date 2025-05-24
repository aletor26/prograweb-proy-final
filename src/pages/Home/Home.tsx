import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import './Home.css';

const Home = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  return (
    <div className="home">
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-image"
              />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">S/ {product.price.toFixed(2)}</span>
                <button 
                  onClick={() => handleAddToCart(product.id)}
                  className="add-to-cart-button"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 