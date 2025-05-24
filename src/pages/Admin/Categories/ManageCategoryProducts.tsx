import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './ManageCategoryProducts.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  inCategory: boolean;
}

const ManageCategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categoryName, setCategoryName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Aquí cargarías los productos de la categoría desde tu backend
    // Por ahora usamos datos de ejemplo
    setCategoryName('Vinos');
    setProducts([
      {
        id: '1',
        name: 'Vino Tinto Reserva',
        price: 29.99,
        image: 'https://placehold.co/100x100',
        inCategory: true
      },
      {
        id: '2',
        name: 'Vino Blanco',
        price: 24.99,
        image: 'https://placehold.co/100x100',
        inCategory: false
      },
    ]);
  }, [categoryId]);

  const handleToggleProduct = (productId: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, inCategory: !product.inCategory }
        : product
    ));
  };

  const handleSave = () => {
    // Aquí enviarías los cambios al backend
    console.log('Guardando cambios para categoría:', categoryId);
    console.log('Productos actualizados:', products);
    navigate('/admin/categories');
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-unauthorized">
        <h2>Acceso No Autorizado</h2>
        <p>No tienes permisos para ver esta página.</p>
        <button onClick={() => navigate('/')} className="back-button">
          Volver al inicio
        </button>
      </div>
    );
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-products-container">
      <div className="manage-products-header">
        <h1>Gestionar Productos - {categoryName}</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="products-list">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-item">
            <div className="product-info">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-details">
                <h3>{product.name}</h3>
                <p>S/ {product.price.toFixed(2)}</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={product.inCategory}
                onChange={() => handleToggleProduct(product.id)}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>

      <div className="manage-products-actions">
        <button 
          className="cancel-button"
          onClick={() => navigate('/admin/categories')}
        >
          Cancelar
        </button>
        <button 
          className="save-button"
          onClick={handleSave}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default ManageCategoryProducts; 