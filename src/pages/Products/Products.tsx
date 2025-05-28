import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import './Products.css';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  return (
    <div className="products-container">
      <h1>Nuestros Productos</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-price">S/. {product.price.toFixed(2)}</p>
              <button 
                className="add-to-cart-button"
                onClick={() => addToCart(product)}
              >
                Agregar al carrito
              </button>
              <button
                  className="add-to-cart-button"
                  onClick={() => navigate(`/detalle/${product.id}`)}
                >
                  Ver detalle
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products; 