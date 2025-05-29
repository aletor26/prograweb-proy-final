import { useEffect, useState } from 'react';
import { getProducts, initializeProducts } from '../../data/products';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel';
import AdCarousel from '../../components/AdCarousel/AdCarousel';
import './Home.css';
import type { Product } from '../../data/products';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    initializeProducts();
    const allProducts = getProducts();
    setProducts(allProducts.filter(p => p.active !== false));
  }, []);

  // 12 más vendidos (puedes cambiar la lógica si tienes ventas reales)
  const bestSellers = products.slice(0, 12);
  const newProducts = products.slice(12, 18);
  const whiskies = products.filter(p => p.category.toLowerCase() === 'whiskies');
  const vinos = products.filter(p => p.category.toLowerCase() === 'vinos');
  const piscos = products.filter(p => p.category.toLowerCase() === 'piscos');

  return (
    <div className="home">
      {/* Sección 1: Carousel de Publicidad */}
      <section className="home-section home-ad-section">
        <AdCarousel />
      </section>

      {/* Sección 2: Más vendidos */}
      <section className="home-section">
        <h2 className="home-section-title">Más vendidos del mes</h2>
        <ProductCarousel products={bestSellers} />
      </section>
      
      {/* Sección 3: Nuevos productos */}
      <section className="home-section">
        <h2 className="home-section-title">Nuevos productos</h2>
        <ProductCarousel products={newProducts} />
      </section>

      {/* Sección 4: Whiskies */}
      <section className="home-section">
        <h2 className="home-section-title">Whiskies</h2>
        <ProductCarousel products={whiskies} />
      </section>

      {/* Sección 5: Vinos */}
      <section className="home-section">
        <h2 className="home-section-title">Vinos</h2>
        <ProductCarousel products={vinos} />
      </section>

      {/* Sección 6: Piscos */}
      <section className="home-section">
        <h2 className="home-section-title">Piscos</h2>
        <ProductCarousel products={piscos} />
      </section>
    </div>
  );
};

export default Home;