import React, { useState } from 'react';
import './AdCarousel.css';

const banners = [
  { id: 1, image: 'https://i.postimg.cc/vTYXRshc/Banner-Mercado-Shops-Black-Friday-Moderno-Negro-Amarillo.jpg' },
  { id: 2, image: 'https://i.postimg.cc/pXcX8dML/Banner-Mercado-Shops-Black-Friday-Moderno-Negro-Amarillo-3.jpg' },
  { id: 3, image: 'https://i.postimg.cc/jSGxgk5V/Banner-Mercado-Shops-Black-Friday-Moderno-Negro-Amarillo-2.jpg' },
  { id: 4, image: 'https://i.postimg.cc/qv74vHtH/Banner-Mercado-Shops-Black-Friday-Moderno-Negro-Amarillo-1.jpg' },
];

const AdCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? banners.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === banners.length - 1 ? 0 : i + 1));

  return (
    <div className="ad-carousel">
      <button className="ad-carousel-btn" onClick={prev}>&#171;</button>
      <img
        src={banners[index].image}
        alt={`Banner ${index + 1}`}
        className="ad-carousel-img"
      />
      <button className="ad-carousel-btn" onClick={next}>&#187;</button>
    </div>
  );
};

export default AdCarousel;