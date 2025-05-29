import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getProducts } from '../../../data/products';
import './AdminProducts.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const loadProducts = () => {
      try {
        const allProducts = getProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
      setIsLoading(false);
    };

    loadProducts();

    const handleStorageChange = () => {
      loadProducts();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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