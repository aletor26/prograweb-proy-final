import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { products as defaultProducts } from '../../data/products';
import './ProductList.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  category: string;
  active: boolean;
}

const PAGE_SIZE = 8;

const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  if (stored) return JSON.parse(stored);
  // Si no hay productos en localStorage, los carga del archivo original y los marca como activos
  const initial = defaultProducts.map(p => ({ ...p, active: true }));
  localStorage.setItem('products', JSON.stringify(initial));
  return initial;
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem('products', JSON.stringify(products));
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(filter.toLowerCase())) ||
    String(p.id).includes(filter)
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleToggleActive = (id: number) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, active: !p.active } : p
    );
    setProducts(updated);
    saveProducts(updated);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setPage(1);
  };

  return (
    <div className="product-list-admin">
      <div className="product-list-header">
        <h2>Productos Registrados</h2>
        <Link to="/admin/products/new" className="add-product-btn">
          + Registrar Producto
        </Link>
      </div>
      <div className="product-list-filters">
        <input
          type="text"
          placeholder="Filtrar por nombre, serie o ID"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>No hay productos</td>
            </tr>
          ) : (
            paginated.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <Link to={`/admin/products/${product.id}`} className="product-detail-link">
                    {product.name}
                  </Link>
                </td>
                <td>{product.category}</td>
                <td>S/ {product.price.toFixed(2)}</td>
                <td>
                  {product.active ? (
                    <span className="active-status">Activo</span>
                  ) : (
                    <span className="inactive-status">Inactivo</span>
                  )}
                </td>
                <td>
                  <button
                    className={product.active ? 'deactivate-btn' : 'activate-btn'}
                    onClick={() => handleToggleActive(product.id)}
                  >
                    {product.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <Link to={`/admin/products/${product.id}`} className="detail-btn">
                    Detalle
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages || 1}</span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProductList;