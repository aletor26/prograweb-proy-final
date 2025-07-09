import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { obtenerProducto, crearProducto, actualizarProducto } from '../../../services/productoservicio';
import { obtenerCategorias } from '../../../services/categoriaservicio'; // <-- IMPORTANTE
import './ProductForm.css';

interface Category {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

interface ProductFormData {
  name: string;
  price: string;
  image: string;
  category: string;
  description: string;
  stock?: string;
}

const ProductForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditing = Boolean(id);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    image: '',
    category: location.state?.selectedCategory || '',
    description: '',
    stock: ''
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    // Cargar categorías desde el backend
    const fetchCategorias = async () => {
      try {
        const cats = await obtenerCategorias();
        // Mapear id a string para que coincida con la interfaz Category
        const mappedCats: Category[] = cats
          .filter((cat: any) => cat.active !== false)
          .map((cat: any) => ({
            id: String(cat.id),
            name: cat.nombre,
            description: cat.descripcion || '',
            active: cat.active
          }));
        setCategories(mappedCats);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategorias();

    if (isEditing && id) {
      fetchProduct();
    }
  }, [user, navigate, id, isEditing]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await obtenerProducto(Number(id));
      if (product) {
        setFormData({
          name: product.name || '',
          price: product.price?.toString() || '',
          image: product.image || '',
          category: product.category || '',
          description: product.description || '',
          stock: product.stock?.toString() || ''
        });
        setImagePreview(product.image || '');
      } else {
        navigate('/admin/products');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre del producto es requerido');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    if (!formData.image.trim()) {
      setError('La URL de la imagen es requerida');
      return;
    }

    if (!formData.category.trim()) {
      setError('La categoría es requerida');
      return;
    }

    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return;
    }

const productData = {
  name: formData.name.trim(),
  price: parseFloat(formData.price),
  image: formData.image.trim(),
  categoryId: parseInt(formData.category), // ✅ Convertimos a number
  description: formData.description.trim(),
  stock: formData.stock?.trim() && !isNaN(parseInt(formData.stock)) ? parseInt(formData.stock): 0,
  active: true
};

console.log("➡️ Stock ingresado:", formData.stock);



    try {
      setLoading(true);
      setError(null);

      if (isEditing && id) {
        await actualizarProducto(Number(id), productData);
      } else {
        console.log(productData)
        await crearProducto(productData);
      }

      // Mostrar mensaje de éxito
      setShowMessage(true);

      // Esperar un momento antes de redirigir
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Actualizar preview de imagen
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="product-form-container">
        <div className="loading">Cargando producto...</div>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      {showMessage && (
        <div className="success-message">
          <p>¡Producto guardado exitosamente!</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <h1>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Nombre del Producto *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Vino Tinto Reserva"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Precio (S/.) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="category-select"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>



        <div className="form-group">
          <label htmlFor="image">URL de la Imagen *</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" onError={() => setImagePreview('')} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe las características del producto..."
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/admin/products')} 
            className="cancel-button"
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 