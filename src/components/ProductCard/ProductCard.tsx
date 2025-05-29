import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);

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
      <button
        className="add-to-cart-btn"
        onClick={() => addToCart(product)}
        tabIndex={hovered ? 0 : -1}
      >
        Añadir al carrito
      </button>
    </div>
  );
};

export default ProductCard;