import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import type { Product } from '../../../data/products';
import { getProducts, addProduct, updateProduct } from '../../../data/products';
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
}

const ProductForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditing = Boolean(id);
  const [showMessage, setShowMessage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    image: '',
    category: location.state?.selectedCategory || '',
    description: ''
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    // Cargar categorías
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      // Solo mostrar categorías activas
      setCategories(parsedCategories.filter((cat: Category) => cat.active));
    }

    if (isEditing) {
      const products = getProducts();
      const product = products.find(p => p.id === Number(id));
      if (product) {
        setFormData({
          name: product.name,
          price: product.price.toString(),
          image: product.image,
          category: product.category,
          description: product.description
        });
      } else {
        navigate('/admin/categories');
      }
    }
  }, [user, navigate, id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      image: formData.image.trim(),
      category: formData.category.trim(),
      description: formData.description.trim()
    };

    try {
      if (isEditing && id) {
        updateProduct({ ...productData, id: Number(id) });
      } else {
        addProduct(productData);
      }

      // Mostrar mensaje de éxito
      setShowMessage(true);

      // Disparar evento para actualizar otros componentes
      window.dispatchEvent(new Event('storage'));

      // Esperar un momento antes de redirigir
      setTimeout(() => {
        // Si hay una ruta de retorno especificada, usarla
        if (location.state?.returnTo) {
          navigate(location.state.returnTo);
        } else {
          navigate('/admin/categories');
        }
      }, 1500);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="product-form-container">
      {showMessage && (
        <div className="success-message">
          <p>¡Producto guardado exitosamente!</p>
        </div>
      )}
      <h1>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Nombre del Producto</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">URL de la Imagen</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría</label>
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
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate(location.state?.returnTo || '/admin/categories')} 
            className="cancel-button"
          >
            Cancelar
          </button>
          <button type="submit" className="save-button">
            {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 