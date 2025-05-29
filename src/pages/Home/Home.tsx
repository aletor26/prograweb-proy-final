import { products } from '../../data/products';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel';
import AdCarousel from '../../components/AdCarousel/AdCarousel';
import './Home.css';

const Home = () => {
  // 12 más vendidos (puedes cambiar la lógica si tienes ventas reales)
  const bestSellers = products.slice(0, 12);
  const whiskies = products.filter(p => p.category.toLowerCase() === 'whiskies');
  const vinos = products.filter(p => p.category.toLowerCase() === 'vinos');

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

      {/* Sección 3: Whiskies */}
      <section className="home-section">
        <h2 className="home-section-title">Whiskies</h2>
        <ProductCarousel products={whiskies} />
      </section>

      {/* Sección 4: Vinos */}
      <section className="home-section">
        <h2 className="home-section-title">Vinos</h2>
        <ProductCarousel products={vinos} />
      </section>
    </div>
  );
};

export default Home;