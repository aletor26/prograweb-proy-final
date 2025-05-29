import React, { useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCarouselProps {
  products: Product[];
}

const VISIBLE_COUNT = 4;

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - VISIBLE_COUNT, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + VISIBLE_COUNT, products.length - VISIBLE_COUNT)
    );
  };

  const visibleProducts = products.slice(startIndex, startIndex + VISIBLE_COUNT);

  return (
    <div className="product-carousel">
      <button
        className="carousel-btn"
        onClick={handlePrev}
        disabled={startIndex === 0}
      >
        &#8592;
      </button>
      <div className="carousel-track">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <button
        className="carousel-btn"
        onClick={handleNext}
        disabled={startIndex + VISIBLE_COUNT >= products.length}
      >
        &#8594;
      </button>
    </div>
  );
};

export default ProductCarousel;