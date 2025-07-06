import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { obtenerProductos, eliminarProducto, actualizarProducto } from '../../../services/productoservicio';
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

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await obtenerProductos();
      setProducts(data.map((p: { active: boolean; }) => ({ ...p, active: p.active !== false })));
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await eliminarProducto(productId);
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        setError('Error al eliminar el producto');
      }
    }
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleToggleActive = async (id: number) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const updatedProduct = { ...product, active: !product.active };
      await actualizarProducto(id, updatedProduct);
      
      const updated = products.map(p =>
        p.id === id ? { ...p, active: !p.active } : p
      );
      setProducts(updated);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setError('Error al actualizar el producto');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="error">{error}</div>
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
        <input
          type="text"
          placeholder="Buscar producto por nombre o categoría..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
        <div className="admin-products-list">
          {products.length === 0 ? (
            <div className="admin-products-no-products">
              <p>No hay productos disponibles</p>
              <p>Haz clic en "Agregar Producto" para crear uno nuevo</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
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
                    className="admin-product-action-button admin-product-edit-button"
                    onClick={() => handleEditProduct(product.id)}
                    title="Editar producto"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="admin-product-action-button admin-product-delete-button"
                    onClick={() => handleDeleteProduct(product.id)}
                    title="Eliminar producto"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                  <button
                    className="product-action-btn"
                    onClick={() => handleToggleActive(product.id)}
                  >
                    {product.active ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;