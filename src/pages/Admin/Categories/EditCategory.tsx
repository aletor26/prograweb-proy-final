import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getProducts, initializeProducts, deleteProduct } from '../../../data/products';
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
  id: string;
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

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    // Inicializar productos si es necesario
    initializeProducts();

    const loadCategoryAndProducts = () => {
      // Cargar categoría
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        const categories = JSON.parse(storedCategories);
        const foundCategory = categories.find((c: Category) => c.id === categoryId);
        if (foundCategory) {
          setCategory(foundCategory);
          // Cargar productos de la categoría desde localStorage
          const allProducts = getProducts();
          const categoryProducts = allProducts.filter(
            p => p.category.toLowerCase().trim() === foundCategory.name.toLowerCase().trim()
          );
          setProducts(categoryProducts);
        } else {
          navigate('/admin/categories');
        }
      }
    };

    loadCategoryAndProducts();

    // Cargar todos los productos (de localStorage o estáticos)
    const stored = localStorage.getItem('products');
    const all = stored ? JSON.parse(stored) : [];
    setAllProducts(all);

    // Escuchar cambios en el almacenamiento
    window.addEventListener('storage', loadCategoryAndProducts);
    return () => {
      window.removeEventListener('storage', loadCategoryAndProducts);
    };
  }, [categoryId, user, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) return;

    try {
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        const categories = JSON.parse(storedCategories);
        const updatedCategories = categories.map((c: Category) =>
          c.id === categoryId ? category : c
        );
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
        // Disparar evento para actualizar el NavBar
        window.dispatchEvent(new Event('storage'));
        navigate('/admin/categories');
      }
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
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
    // Navegar a la página de agregar producto con la categoría preseleccionada
    navigate('/admin/products/new', {
      state: { selectedCategory: category?.name }
    });
  };

  const handleEditProduct = (productId: number) => {
    // Navegar a la página de editar producto
    navigate(`/admin/products/${productId}/edit`, {
      state: { returnTo: `/admin/categories/${categoryId}/edit` }
    });
  };

  const handleShowAddExistingProduct = () => setShowAddExisting(true);

  const handleAddExistingProduct = () => {
    if (!selectedProductId) return;
    const categoryName = category?.name ?? '';
    const updatedAllProducts = allProducts.map(p =>
      p.id === Number(selectedProductId) ? { ...p, category: categoryName } : p
    );
    setAllProducts(updatedAllProducts);
    localStorage.setItem('products', JSON.stringify(updatedAllProducts));
    // Actualiza la lista de la categoría actual
    const categoryProducts = updatedAllProducts.filter(
      (p: Product) => p.category.toLowerCase().trim() === categoryName.toLowerCase().trim()
    );
    setProducts(categoryProducts);
    setShowAddExisting(false);
  };

  if (!category) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="edit-category">
      <h1>Editar Categoría</h1>
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
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={category.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Imagen de la Categoría</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          {category.image && (
            <img src={category.image} alt="Vista previa" style={{ maxWidth: 120, marginTop: 8, borderRadius: 8 }} />
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/categories')} className="cancel-button">
            Cancelar
          </button>
          <button type="submit" className="save-button">
            Guardar Cambios
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
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                            deleteProduct(product.id);
                            const updatedProducts = products.filter(p => p.id !== product.id);
                            setProducts(updatedProducts);
                            window.dispatchEvent(new Event('storage'));
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