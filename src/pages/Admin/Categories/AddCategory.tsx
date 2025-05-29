import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AddCategory.css';

interface Category {
  id: string;
  name: string;
  description: string;
  active: boolean;
  image?: string;
}

const AddCategory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const storedCategories = localStorage.getItem('categories');
    const categories: Category[] = storedCategories ? JSON.parse(storedCategories) : [];
    
    if (categories.some(cat => cat.name.toLowerCase() === formData.name.trim().toLowerCase())) {
      setError('Ya existe una categoría con este nombre');
      return;
    }

    // Crear nueva categoría
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      active: true,
      image: formData.image
    };

    // Guardar en localStorage
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));

    // Disparar evento para actualizar el NavBar
    window.dispatchEvent(new Event('storage'));

    // Redirigir a la lista de categorías
    navigate('/admin/categories');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="add-category">
      <div className="add-category-header">
        <h1>Agregar Nueva Categoría</h1>
      </div>

      <div className="add-category-form-container">
        <form onSubmit={handleSubmit} className="add-category-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Nombre de la Categoría *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Vinos Tintos"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe la categoría..."
              className="form-input"
              rows={4}
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
            {formData.image && (
              <img src={formData.image} alt="Vista previa" style={{ maxWidth: 120, marginTop: 8, borderRadius: 8 }} />
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/admin/categories')}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Crear Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;