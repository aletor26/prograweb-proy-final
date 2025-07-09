import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { obtenerCategoriaPorId, actualizarCategoria } from '../../../services/categoriaservicio';
import {
  obtenerProductosPorCategoria
} from '../../../services/productoservicio';
import './EditCategory.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  categoryId: number;
  stock: number;
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

        const productosRelacionados = await obtenerProductosPorCategoria(Number(categoryId));
        setProducts(productosRelacionados);
      } catch (err) {
        console.error(err);
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
          <button type="submit" className="save-button" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>

      <div className="category-products">
        <div className="products-header">
          <h2>Productos de la Categoría</h2>
          <div className="products-header-actions">
            <button className="add-product-button" onClick={handleAddProduct}>Agregar Producto</button>
          </div>
        </div>

        <div className="products-list">
          {products.length === 0 ? (
            <p className="no-products">No hay productos en esta categoría</p>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Descripción</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    
                    <td>{p.name}</td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>{p.description}</td>
                    <td>{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
