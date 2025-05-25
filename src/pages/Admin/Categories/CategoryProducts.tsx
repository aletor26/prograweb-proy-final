import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products as staticProducts } from '../../../data/products';
import './CategoryProducts.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CategoryProductsProps {
  categoryId: string;
  categoryName: string;
}

const CategoryProducts = ({ categoryId, categoryName }: CategoryProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar productos de la categoría desde los datos estáticos
    const categoryProducts = staticProducts.filter(
      p => p.category.toLowerCase().trim() === categoryName.toLowerCase().trim()
    );
    setProducts(categoryProducts);
  }, [categoryName]);

  return (
    <div className="category-products">
      <div className="products-header">
        <h2>Productos de la Categoría</h2>
        <button 
          className="add-product-button"
          onClick={() => navigate('/admin/products/new')}
        >
          <i className="fas fa-plus"></i> Agregar Producto
        </button>
      </div>

      <div className="products-list">
        <h3>Productos Existentes ({products.length})</h3>
        {products.length === 0 ? (
          <p className="no-products">No hay productos en esta categoría</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <div className="product-main-info">
                    <div className="product-image">
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className="no-image">Sin imagen</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="product-price">${product.price.toFixed(2)}</p>
                      <p className="product-description">{product.description}</p>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      className="action-button edit-button"
                      onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                      title="Editar producto"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                          // Aquí iría la lógica de eliminación cuando implementemos el backend
                          alert('Funcionalidad de eliminación pendiente de implementar');
                        }
                      }}
                      title="Eliminar producto"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts; 