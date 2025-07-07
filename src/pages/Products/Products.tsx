import { useCart } from '../../context/CartContext';
import { useEffect, useState } from 'react';
import { obtenerProductos } from '../../services/productoservicio';
import './Products.css';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  active?: boolean;
}

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await obtenerProductos();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const activeProducts = products.filter(p => p.active !== false);

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error">{error}</div>
      </div>
    );
  }

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