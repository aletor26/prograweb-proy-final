import { useCart } from '../../context/CartContext';
import { useEffect, useState } from 'react';
import { getProducts, initializeProducts } from '../../data/products';
import './Products.css';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../data/products';

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    initializeProducts();
    const allProducts = getProducts();
    setProducts(allProducts.map(p => ({ ...p, active: p.active !== false })));
  }, []);

  const activeProducts = products.filter(p => p.active !== false);

  return (
    <div className="products-container">
      <h1>Nuestros Productos</h1>
      <div className="products-grid">
        {activeProducts.map((product) => (
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