import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { crearCategoria, obtenerCategorias } from '../../../services/categoriaservicio';
import './AddCategory.css';

const AddCategory = () => {
  const navigate = useNavigate();
  useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    setIsSubmitting(true);
    try {
      // Verificar si ya existe una categoría con el mismo nombre
      const categorias = await obtenerCategorias();
      if (categorias.some(cat => cat.name.toLowerCase() === formData.name.trim().toLowerCase())) {
        setError('Ya existe una categoría con este nombre');
        setIsSubmitting(false);
        return;
      }

      await crearCategoria({
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image
      });

      navigate('/admin/categories');
    } catch (e) {
      setError('Error al crear la categoría');
    }
    setIsSubmitting(false);
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
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              Crear Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;