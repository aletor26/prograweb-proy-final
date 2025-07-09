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
  categoryId: number;
}

interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
}

const EditCategory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [showAddExisting, setShowAddExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const loadData = async () => {
      if (!categoryId) return;
      try {
        setLoading(true);

        const cat = await obtenerCategoriaPorId(Number(categoryId));
        setCategory(cat);

        const all = await obtenerProductos();
        setAllProducts(all);

        const categoryProducts = all.filter((p: Product) => p.categoryId === Number(categoryId));
        setProducts(categoryProducts);
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!category) return;
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    try {
      setIsSubmitting(true);
      await actualizarCategoria(category.id, category);
      navigate('/admin/categories');
    } catch (err) {
      setError('Error al actualizar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = () => {
    navigate('/admin/products/new', { state: { selectedCategoryId: category?.id } });
  };

  const handleEditProduct = (id: number) => {
    navigate(`/admin/products/${id}/edit`, { state: { returnTo: `/admin/categories/${categoryId}/edit` } });
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await eliminarProducto(id);
      setProducts(products.filter((p: Product) => p.id !== id));
      setAllProducts(allProducts.filter((p: Product) => p.id !== id));
    } catch {
      alert('Error al eliminar');
    }
  };

  const handleAddExistingProduct = async () => {
    if (!selectedProductId || !category) return;

    const confirm = window.confirm('¿Agregar este producto a la categoría?');
    if (!confirm) return;

    const product = allProducts.find((p: Product) => p.id === selectedProductId);
    if (!product) return;

    try {
      await actualizarProducto(product.id, { ...product, categoryId: category.id });
      const updated = await obtenerProductos();
      setAllProducts(updated);
      const categoryProducts = updated.filter((p: Product) => p.categoryId === category.id);
      setProducts(categoryProducts);
      setShowAddExisting(false);
    } catch {
      alert('Error al actualizar el producto');
    }
  };

  if (loading) return <div className="edit-category">Cargando...</div>;
  if (error) return <div className="edit-category error-message">{error}</div>;
  if (!category) return <div className="edit-category">Categoría no encontrada</div>;

  return (
    <div className="edit-category">
      <h1>Editar Categoría</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={category.nombre || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={category.descripcion || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="imagen">Imagen (URL)</label>
          <input
            id="imagen"
            name="imagen"
            value={category.imagen || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => navigate('/admin/categories')}>Cancelar</button>
          <button type="submit" className="save-button" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</button>
        </div>
      </form>

      <div className="category-products">
        <div className="products-header">
          <h2>Productos de la Categoría</h2>
          <div className="products-header-actions">
            <button className="add-product-button" onClick={handleAddProduct}>Agregar Producto</button>
            <button className="add-existing-product-button" onClick={() => setShowAddExisting(true)}>Agregar producto existente</button>
          </div>
        </div>

        <div className="products-list">
          {products.length === 0 ? (
            <p className="no-products">No hay productos en esta categoría</p>
          ) : (
            <div className="products-grid">
              {products.map((p: Product) => (
                <div key={p.id} className="product-card">
                  <div className="product-content">
                    <h4>{p.name}</h4>
                    <p className="product-price">${p.price.toFixed(2)}</p>
                    <p className="product-description">{p.description}</p>
                    <div className="product-actions">
                      <button className="action-button edit-button" onClick={() => handleEditProduct(p.id)}>Editar</button>
                      <button className="action-button delete-button" onClick={() => handleDeleteProduct(p.id)}>Eliminar</button>
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
              {allProducts.filter((p: Product) => p.categoryId !== category.id).map((p: Product) => (
                <div key={p.id} className="existing-product-item">
                  <img src={p.image} alt={p.name} className="existing-product-image" />
                  <div className="existing-product-info">
                    <span className="existing-product-name">{p.name}</span>
                    <span className="existing-product-price">${p.price.toFixed(2)}</span>
                  </div>
                  <button className="add-existing-btn" onClick={() => {
                    setSelectedProductId(p.id);
                    handleAddExistingProduct();
                  }}>Agregar</button>
                </div>
              ))}
              {allProducts.filter((p: Product) => p.categoryId !== category.id).length === 0 && (
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
