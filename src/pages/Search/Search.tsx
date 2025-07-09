import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { obtenerProductos } from '../../services/productoservicio';
import { useCart } from '../../context/CartContext';
import Filtro_orden from '../../components/Filtro_orden/Filtro_orden';
import './Search.css';
import { obtenerCategorias } from '../../services/categoriaservicio';
import type { Categoria } from '../../services/categoriaservicio';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  active?: boolean;
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState(query);
  // Estado para el tipo de ordenamiento
  const [sort, setSort] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [productosConCategoria, setProductosConCategoria] = useState<Product[]>([]);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    Promise.all([obtenerProductos(), obtenerCategorias()])
      .then(([productos, categorias]) => {
        setProducts(productos);
        setCategories(categorias);
        // Mapea el nombre real de la categoría
        const categoriasMap = Object.fromEntries(
          categorias.map((cat: any) => [cat.id, cat.nombre])
        );
        const productosMapeados = productos.map((p: any) => ({
          ...p,
          category: categoriasMap[p.categoriaId] || 'Sin categoría'
        }));
        setProductosConCategoria(productosMapeados.filter((p: any) => p.active !== false));
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching products or categories:', err);
        setError('Error al cargar los productos');
        setProducts([]);
        setCategories([]);
        setProductosConCategoria([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Reemplaza activeProducts por productosConCategoria en el filtrado
  const filteredProducts = productosConCategoria.filter(product => {
    const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? (product.category || '').trim().toLowerCase() === selectedCategory.trim().toLowerCase()
      : true;
    return matchesName && matchesCategory;
  });

  // Ordenamiento
  const sortedResults = [...filteredProducts].sort((a, b) => {
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    if (sort === 'name-desc') return b.name.localeCompare(a.name);
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return 0;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSearchParams({ q: e.target.value });
  };

  if (error) {
    return (
      <div className="search-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="search-container">
      <h1 className="search-title">Resultados de búsqueda</h1>
      <div className="admin-search-bar" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          className="admin-search-input"
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <select
          className="admin-search-select"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
          ))}
        </select>
      </div>
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