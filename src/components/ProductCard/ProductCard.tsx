import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './ProductCard.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, moveToSaved } = useCart();
  const { user } = useAuth();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="product-card-blur">
        <div className="product-card-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-card-content">
          <div className="product-card-category">{product.category}</div>
          <div className="product-card-title">{product.name}</div>
          <div className="product-card-price">S/ {product.price}</div>
        </div>
      </div>
      {hovered && (
        <div className="product-card-actions">
          <button
            className="add-to-cart-btn"
            onClick={() => addToCart(product)}
            tabIndex={0}
          >
            Añadir al carrito
          </button>
          <button
            className="save-to-wishlist-btn"
            onClick={() => {
              if (!user) {
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                window.location.href = '/login';
                return;
              }
              moveToSaved(product.id);
            }}
            tabIndex={0}
          >
            Guardar para después
          </button>
          <button
            className="details-btn"
            onClick={() => navigate(`/detalle/${product.id}`)}
            tabIndex={0}
          >
            Ver detalles
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;