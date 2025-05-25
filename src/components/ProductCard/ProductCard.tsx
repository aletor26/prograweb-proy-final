import { Link } from 'react-router-dom';
import './ProductCard.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-container">
        <div className="product-card-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className="product-card-content">
          <p className="product-card-category">{product.category}</p>
          <h3 className="product-card-title">
            {product.name}
          </h3>
          <p className="product-card-price">
            S/ {product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 