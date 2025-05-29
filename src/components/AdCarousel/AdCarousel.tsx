import React, { useState } from 'react';
import './AdCarousel.css';

const banners = [
  { id: 1, image: 'https://placehold.co/1200x350/1976d2/fff?text=Oferta+Especial+1' },
  { id: 2, image: 'https://placehold.co/1200x350/388e3c/fff?text=Descuento+en+Whiskies' },
  { id: 3, image: 'https://placehold.co/1200x350/d32f2f/fff?text=Vinos+Premium' },
];

const AdCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? banners.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === banners.length - 1 ? 0 : i + 1));

  return (
    <div className="ad-carousel">
      <button className="ad-carousel-btn" onClick={prev}>&#8592;</button>
      <img
        src={banners[index].image}
        alt={`Banner ${index + 1}`}
        className="ad-carousel-img"
      />
      <button className="ad-carousel-btn" onClick={next}>&#8594;</button>
    </div>
  );
};

export default AdCarousel;