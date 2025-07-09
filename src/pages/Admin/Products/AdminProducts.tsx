import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { obtenerProductosAdmin, toggleProductoActivo, testBackendConnection } from '../../../services/productoservicio';
import './AdminProducts.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  active: boolean;
}

interface ProductsResponse {
  productos: Product[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'nombre' | 'id'>('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productsPerPage] = useState(10);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    console.log('AdminProducts useEffect - user:', user);
    
    if (!user) {
      console.log('No user found, redirecting to home');
      navigate('/');
      return;
    }

    if (user.role !== 'admin') {
      console.log('User is not admin, redirecting to home');
      navigate('/');
      return;
    }

    console.log('User is admin, testing backend connection...');
    testBackendConnection()
      .then(() => {
        console.log('Backend connection successful, fetching products...');
        setIsLoading(true);
        setError(null);
        obtenerProductosAdmin({ pagina: 1, porPagina: 1000 })
          .then((response: ProductsResponse) => {
            setAllProducts(response.productos || []);
            setError(null);
          })
          .catch((err) => {
            setError(err instanceof Error ? err.message : 'Error al cargar los productos');
            setAllProducts([]);
          })
          .finally(() => setIsLoading(false));
      })
      .catch((err) => {
        console.error('Backend connection failed:', err);
        setError(`Error de conexión con el backend: ${err.message}`);
        setIsLoading(false);
      });
  }, [user, navigate]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return allProducts;
    return allProducts.filter((product) => {
      if (searchField === 'id') {
        return product.id.toString().includes(searchTerm);
      } else if (searchField === 'nombre') {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });
  }, [allProducts, searchTerm, searchField]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, productsPerPage]);

  useEffect(() => {
    setProducts(paginatedProducts);
    const newTotalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
    setTotalPages(newTotalPages);
    setTotalProducts(filteredProducts.length);
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [paginatedProducts, filteredProducts, currentPage, productsPerPage]);

  const handleEditProduct = (productId: number) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/admin/products/${productId}`);
  };

  const handleToggleActive = async (id: number) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      await toggleProductoActivo(id, !product.active);
      
      // Actualizar el estado local
      const updated = products.map(p =>
        p.id === id ? { ...p, active: !p.active } : p
      );
      setProducts(updated);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setError('Error al actualizar el estado del producto');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Debug info
  console.log('AdminProducts render - user:', user, 'isLoading:', isLoading, 'error:', error, 'products count:', products.length);

  if (isLoading) {
    return (
      <div className="admin-products">
        <div className="admin-products-loading">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-products">
        <div className="error">
          <h3>Error al cargar productos</h3>
          <p>{error}</p>
          <button onClick={() => obtenerProductosAdmin({ pagina: 1, porPagina: 1000 })} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <h1>Gestión de Productos</h1>
        <button 
          className="admin-products-add-button"
          onClick={() => navigate('/admin/products/new')}
        >
          <i className="fas fa-plus"></i> Agregar Producto
        </button>
      </div>

      <div className="admin-products-section">
        <div className="admin-search-section">
          <select
            value={searchField}
            onChange={e => setSearchField(e.target.value as 'nombre' | 'id')}
            className="admin-search-select"
          >
            <option value="nombre">Nombre</option>
        
            <option value="id">ID</option>
          </select>
          <input
            type="text"
            placeholder={`Buscar por ${searchField}`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
          {/* El botón Buscar ya no se usa, el filtrado es instantáneo */}
        </div>

        <div className="admin-products-info">
          <p>Total de productos: {totalProducts}</p>
          <p>Página {currentPage} de {totalPages}</p>
        </div>

        <div className="admin-products-list">
          {products.length === 0 ? (
            <div className="admin-products-no-products">
              <p>No hay productos disponibles</p>
              <p>Haz clic en "Agregar Producto" para crear uno nuevo</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="admin-product-card">
                <div className="admin-product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="admin-product-info">
                  <h3>{product.name}</h3>
                  <p className="admin-product-description">{product.description}</p>
                  <p className="admin-product-category">Categoría: {product.category}</p>
                  <p className="admin-product-price">S/. {product.price.toFixed(2)}</p>
                  <p className={product.active ? "estado-activo" : "estado-inactivo"}>
                    {product.active ? "Activo" : "Inactivo"}
                  </p>
                </div>
                <div className="admin-product-actions">
                  <button 
                    className="admin-product-action-button admin-product-view-button"
                    onClick={() => handleViewProduct(product.id)}
                    title="Ver detalles"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    className="admin-product-action-button admin-product-edit-button"
                    onClick={() => handleEditProduct(product.id)}
                    title="Editar producto"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className={`admin-product-toggle-button ${product.active ? 'deactivate' : 'activate'}`}
                    onClick={() => handleToggleActive(product.id)}
                    title={product.active ? "Desactivar producto" : "Activar producto"}
                  >
                    {product.active ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Anterior
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;