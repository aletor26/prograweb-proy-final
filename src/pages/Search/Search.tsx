import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../../data/products';
import './Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading] = useState(false);

  const searchResults = products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-container">
      <h1 className="search-title">Resultados de búsqueda</h1>
      <p className="search-query">Mostrando resultados para: "{query}"</p>

      {isLoading ? (
        <div className="search-loading">Buscando productos...</div>
      ) : searchResults.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron productos que coincidan con tu búsqueda</p>
        </div>
      ) : (
        <div className="search-results">
          {searchResults.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">S/. {product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search; 