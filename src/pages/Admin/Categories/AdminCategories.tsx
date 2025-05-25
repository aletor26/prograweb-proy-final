import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { products as staticProducts } from '../../../data/products';
import './AdminCategories.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  active: boolean;
}

const AdminCategories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para contar productos por categoría
  const countProductsByCategory = (categoryName: string): number => {
    return staticProducts.filter(product => 
      product.category?.toLowerCase().trim() === categoryName.toLowerCase().trim()
    ).length;
  };

  useEffect(() => {
    // Verificar si el usuario es admin
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    // Cargar categorías y productos
    const loadCategoriesAndProducts = () => {
      try {
        const storedCategories = localStorage.getItem('categories');
        
        if (storedCategories) {
          const parsedCategories = JSON.parse(storedCategories);
          
          // Calcular el número de productos por categoría usando los productos estáticos
          const categoriesWithCount = parsedCategories.map((category: Category) => {
            const count = countProductsByCategory(category.name);
            return {
              ...category,
              productCount: count
            };
          });
          
          setCategories(categoriesWithCount);
        }
      } catch (error) {
        console.error('Error al cargar categorías y productos:', error);
      }
      setIsLoading(false);
    };

    loadCategoriesAndProducts();
    
    // Escuchar cambios en el almacenamiento
    const handleStorageChange = () => {
      loadCategoriesAndProducts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, navigate]);

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        const updatedCategories = categories.filter(category => category.id !== categoryId);
        setCategories(updatedCategories);
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
        // Disparar evento para actualizar el NavBar
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  const handleToggleActive = (categoryId: string) => {
    try {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return { ...category, active: !category.active };
        }
        return category;
      });
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      // Disparar evento para actualizar el NavBar
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error al cambiar estado de categoría:', error);
    }
  };

  const handleEditCategory = (categoryId: string) => {
    navigate(`/admin/categories/${categoryId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="admin-categories">
        <div className="loading">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="admin-categories">
      <div className="admin-header">
        <h1>Gestión de Categorías</h1>
        <button 
          className="add-category-button"
          onClick={() => navigate('/admin/categories/new')}
        >
          <i className="fas fa-plus"></i> Agregar Categoría
        </button>
      </div>

      <div className="categories-section">
        <div className="categories-list">
          {categories.length === 0 ? (
            <div className="no-categories">
              <p>No hay categorías disponibles</p>
              <p>Haz clic en "Agregar Categoría" para crear una nueva</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className={`category-card ${!category.active ? 'inactive' : ''}`}>
                <div className="category-header">
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                    <p className="product-count">{category.productCount} productos</p>
                  </div>
                  <div className="category-actions">
                    <button 
                      className="action-button edit-button"
                      onClick={() => handleEditCategory(category.id.toString())}
                      title="Editar categoría"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-button toggle-button"
                      onClick={() => handleToggleActive(category.id.toString())}
                      title={category.active ? "Desactivar categoría" : "Activar categoría"}
                    >
                      <i className={`fas fa-${category.active ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                    <button 
                      className="action-button delete-button"
                      onClick={() => handleDeleteCategory(category.id.toString())}
                      title="Eliminar categoría"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories; 