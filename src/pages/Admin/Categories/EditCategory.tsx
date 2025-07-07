import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { obtenerCategoriaPorId, actualizarCategoria } from '../../../services/categoriaservicio';
import { obtenerProductos, actualizarProducto, eliminarProducto } from '../../../services/productoservicio';
import './EditCategory.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
  image?: string;
}

const EditCategory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddExisting, setShowAddExisting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const loadCategoryAndProducts = async () => {
      if (!categoryId) return;
      setLoading(true);
      setError(null);
      try {
        console.log('Cargando categoría con ID:', categoryId);
        const cat: any = await obtenerCategoriaPorId(Number(categoryId));
        
        console.log('Datos crudos de la categoría:', cat);
        
        // Transformar los datos del backend al formato que espera el frontend
        const transformedCategory = {
          id: cat.id,
          name: cat.nombre, // El modelo real usa 'nombre'
          description: '', // No existe en el modelo
          active: true, // No existe en el modelo
          image: '' // No existe en el modelo
        };
        
        console.log('Categoría transformada:', transformedCategory);
        
        // Validar que cat tenga los campos requeridos
        if (!transformedCategory.id || !transformedCategory.name) {
          setError('Categoría no válida: faltan campos requeridos');
          return;
        }
        
        setCategory(transformedCategory);

        // Cargar productos desde el backend
        console.log('Cargando productos...');
        const all = await obtenerProductos();
        
        console.log('Productos crudos del backend:', all);
        
        // Transformar productos si es necesario
        const transformedProducts = all.map((product: any) => ({
          id: product.id,
          name: product.name || product.nombre,
          price: product.price || product.precio,
          image: product.image || product.url_imagen,
          description: product.description || product.descripcion,
          category: product.category || product.categoria
        }));
        
        console.log('Productos transformados:', transformedProducts);
        
        setAllProducts(transformedProducts);
        const categoryProducts = transformedProducts.filter(
          (p: Product) => p.category?.toLowerCase().trim() === transformedCategory.name.toLowerCase().trim()
        );
        console.log('Productos de la categoría:', categoryProducts);
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Error al cargar categoría:', error);
        setError('Error al cargar la categoría: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryAndProducts();
    // eslint-disable-next-line
  }, [categoryId, user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) return;

    setIsSubmitting(true);
    setError(null);
    console.log('=== INICIANDO ACTUALIZACIÓN DE CATEGORÍA ===');
    console.log('ID de categoría:', category.id);
    console.log('Datos de categoría a enviar:', category);

    try {
      const result = await actualizarCategoria(category.id, {
        name: category.name,
        description: category.description,
        image: category.image,
        active: category.active,
      });
      
      console.log('=== ACTUALIZACIÓN EXITOSA ===');
      console.log('Respuesta del backend:', result);
      navigate('/admin/categories');
    } catch (error) {
      console.error('=== ERROR EN ACTUALIZACIÓN ===');
      console.error('Error completo:', error);
      setError('Error al guardar la categoría: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (category) {
      setCategory({ ...category, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && category) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategory({ ...category, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    navigate('/admin/products/new', {
      state: { selectedCategory: category?.name }
    });
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/admin/products/${productId}/edit`, {
      state: { returnTo: `/admin/categories/${categoryId}/edit` }
    });
  };

  const handleShowAddExistingProduct = () => setShowAddExisting(true);

  const handleAddExistingProduct = async () => {
    if (!selectedProductId || !category) return;
    try {
      const product = allProducts.find(p => p.id === Number(selectedProductId));
      if (!product) return;
      await actualizarProducto(product.id, { ...product, category: category.name });
      // Refrescar productos
      const all = await obtenerProductos();
      setAllProducts(all);
      const categoryProducts = all.filter(
        (p: Product) => p.category?.toLowerCase().trim() === category.name.toLowerCase().trim()
      );
      setProducts(categoryProducts);
      setShowAddExisting(false);
    } catch (e) {
      alert('Error al agregar producto existente');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      await eliminarProducto(productId);
      setProducts(products.filter(p => p.id !== productId));
      setAllProducts(allProducts.filter(p => p.id !== productId));
    } catch (e) {
      alert('Error al eliminar el producto');
    }
  };

  if (loading) {
    return <div className="edit-category">Cargando categoría...</div>;
  }

  if (error) {
    return (
      <div className="edit-category">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/categories')}>Volver a Categorías</button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="edit-category">
        <div className="error-message">
          <h2>Categoría no encontrada</h2>
          <button onClick={() => navigate('/admin/categories')}>Volver a Categorías</button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-category">
      <h1>Editar Categoría</h1>
      {error && <div className="error-message">{error}</div>}
      
      {/* Nota: Solo se puede editar el nombre */}
      <div className="warning-message" style={{
        background: 'rgba(255, 193, 7, 0.1)',
        border: '1px solid rgba(255, 193, 7, 0.3)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        color: '#ffc107'
      }}>
        <strong>Nota:</strong> El modelo de categoría solo tiene el campo nombre. 
        Los campos de descripción e imagen no están disponibles.
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre de la Categoría</label>
          <input
            type="text"
            id="name"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción (No disponible)</label>
          <textarea
            id="description"
            name="description"
            value={category.description}
            disabled={true}
            style={{ opacity: 0.5 }}
            placeholder="Campo no disponible en el modelo actual"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Imagen de la Categoría (No disponible)</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            disabled={true}
            style={{ opacity: 0.5 }}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/admin/categories')} 
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="save-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>

      <div className="category-products">
        <div className="products-header">
          <h2>Productos de la Categoría</h2>
          <div className="products-header-actions">
            <button 
              className="add-product-button"
              onClick={handleAddProduct}
            >
              <i className="fas fa-plus"></i> Agregar Producto
            </button>
            <button 
              className="add-existing-product-button"
              onClick={handleShowAddExistingProduct}
            >
              <i className="fas fa-plus-square"></i> Agregar producto existente
            </button>
          </div>
        </div>

        <div className="products-list">
          <h3>Productos Existentes ({products.length})</h3>
          {products.length === 0 ? (
            <p className="no-products">No hay productos en esta categoría</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-content">
                    <h4>{product.name}</h4>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <p className="product-description">{product.description}</p>
                    <div className="product-actions">
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEditProduct(product.id)}
                        title="Editar producto"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDeleteProduct(product.id)}
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
        {showAddExisting && (
          <div className="modal-add-existing-product">
            <h4>Selecciona un producto para agregar</h4>
            <div className="existing-products-list">
              {allProducts
                .filter(p => p.category !== category?.name)
                .map(p => (
                  <div key={p.id} className="existing-product-item">
                    <img src={p.image} alt={p.name} className="existing-product-image" />
                    <div className="existing-product-info">
                      <span className="existing-product-name">{p.name}</span>
                      <span className="existing-product-price">${p.price.toFixed(2)}</span>
                    </div>
                    <button className="add-existing-btn" onClick={() => {
                      setSelectedProductId(p.id.toString());
                      handleAddExistingProduct();
                    }}>Agregar</button>
                  </div>
                ))}
              {allProducts.filter(p => p.category !== category?.name).length === 0 && (
                <div className="no-products">No hay productos disponibles para agregar.</div>
              )}
            </div>
            <button className="cancel-existing-btn" onClick={() => setShowAddExisting(false)}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCategory;