import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { useNavigate } from 'react-router-dom';
import './Category.css';

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const categoryProducts = products.filter(
    product => product.category.toLowerCase() === category?.toLowerCase()
  );

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';

  return (
    <div className="category-container">
      <h1>{categoryName}</h1>
      {categoryProducts.length === 0 ? (
        <p className="no-products">No hay productos en esta categoría</p>
      ) : (
        <div className="products-grid">
          {categoryProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
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
      )}
    </div>
  );
};

export default Category; 