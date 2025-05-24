import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminCategories.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  productCount: number;
  products: Product[];
  image?: string;
}

const AdminCategories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([
    { 
      id: '1', 
      name: 'Vinos', 
      productCount: 3,
      products: [
        {
          id: '1-1',
          name: 'Vino Tinto Reserva',
          price: 89.90,
          image: 'https://placehold.co/100x100',
          description: 'Vino tinto reserva especial'
        },
        {
          id: '1-2',
          name: 'Vino Blanco Chardonnay',
          price: 69.90,
          image: 'https://placehold.co/100x100',
          description: 'Vino blanco chardonnay premium'
        }
      ]
    },
    { 
      id: '2', 
      name: 'Piscos', 
      productCount: 2,
      products: [
        {
          id: '2-1',
          name: 'Pisco Quebranta',
          price: 79.90,
          image: 'https://placehold.co/100x100',
          description: 'Pisco quebranta premium'
        }
      ]
    },
    { 
      id: '3', 
      name: 'Whiskies', 
      productCount: 4,
      products: [
        {
          id: '3-1',
          name: 'Whisky 12 años',
          price: 159.90,
          image: 'https://placehold.co/100x100',
          description: 'Whisky premium 12 años'
        }
      ]
    }
  ]);

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (user?.role !== 'admin') {
    return (
      <div className="admin-unauthorized">
        <h2>Acceso No Autorizado</h2>
        <p>No tienes permisos para ver esta página.</p>
        <Link to="/" className="back-link">Volver al inicio</Link>
      </div>
    );
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      setCategories(categories.filter(category => category.id !== categoryId));
    }
  };

  const handleDeleteProduct = (categoryId: string, productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setCategories(categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            products: category.products.filter(product => product.id !== productId),
            productCount: category.productCount - 1
          };
        }
        return category;
      }));
    }
  };

  return (
    <div className="admin-categories-container">
      <div className="admin-categories-header">
        <h1>Gestión de Categorías</h1>
        <button className="add-category-button">
          <i className="fas fa-plus"></i> Agregar Categoría
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-header">
              <h2>{category.name}</h2>
              <div className="category-actions">
                <button 
                  className="expand-button"
                  onClick={() => setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )}
                >
                  <i className={`fas fa-chevron-${expandedCategory === category.id ? 'up' : 'down'}`}></i>
                </button>
                <button 
                  className="delete-category-button"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <div className="category-info">
              <p>{category.productCount} productos</p>
            </div>

            {expandedCategory === category.id && (
              <div className="category-products">
                <div className="products-header">
                  <h3>Productos</h3>
                  <Link 
                    to={`/admin/categories/${category.id}/products/new`} 
                    className="add-product-button"
                  >
                    <i className="fas fa-plus"></i> Agregar Producto
                  </Link>
                </div>
                <div className="products-list">
                  {category.products.map(product => (
                    <div key={product.id} className="product-item">
                      <img src={product.image} alt={product.name} />
                      <div className="product-details">
                        <h4>{product.name}</h4>
                        <p>S/ {product.price.toFixed(2)}</p>
                      </div>
                      <div className="product-actions">
                        <button 
                          className="edit-product-button"
                          onClick={() => navigate(`/admin/categories/${category.id}/products/${product.id}/edit`)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="delete-product-button"
                          onClick={() => handleDeleteProduct(category.id, product.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories; 