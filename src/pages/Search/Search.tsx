import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import Filtro_orden from '../../components/Filtro_orden/Filtro_orden';
import './Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Estado para el tipo de ordenamiento
  const [sort, setSort] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');

  // Filtrado
  const searchResults = products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );

  // Ordenamiento
  const sortedResults = [...searchResults].sort((a, b) => {
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    if (sort === 'name-desc') return b.name.localeCompare(a.name);
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="search-container">
      <h1 className="search-title">Resultados de búsqueda</h1>
      <p className="search-query">Mostrando resultados para: "{query}"</p>

      <Filtro_orden sort={sort} setSort={setSort} />

      {isLoading ? (
        <div className="search-loading">Buscando productos...</div>
      ) : sortedResults.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron productos que coincidan con tu búsqueda</p>
        </div>
      ) : (
        <div className="search-results">
          {sortedResults.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">S/. {product.price.toFixed(2)}</p>
                <button
                  className="add-to-cart-button"
                  onClick={() => navigate(`/detalle/${product.id}`)}
                >
                  Ver detalle
                </button>
                <button 
                  className="add-to-cart-button"
                  onClick={() => addToCart(product)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;