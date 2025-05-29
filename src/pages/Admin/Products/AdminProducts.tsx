import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getProducts, initializeProducts } from '../../../data/products';
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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    initializeProducts();
    const allProducts = getProducts();
    // Asegúrate de que todos tengan el campo active
    setProducts(allProducts.map(p => ({ ...p, active: p.active !== false })));
    setIsLoading(false);
  }, [user, navigate]);

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const updatedProducts = products.filter(product => product.id !== productId);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleToggleActive = (id: number) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, active: !p.active } : p
    );
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
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