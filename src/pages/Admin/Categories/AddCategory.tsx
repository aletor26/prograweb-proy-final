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
      const categorias: any[] = await obtenerCategorias();
      
      // Transformar los datos del backend al formato que espera el frontend
      const transformedCategories = categorias.map((cat: any) => ({
        id: cat.id,
        name: cat.nombre, // El modelo real usa 'nombre'
        description: '', // No existe en el modelo
        image: '', // No existe en el modelo
        active: true // No existe en el modelo
      }));
      
      if (transformedCategories.some(cat => cat.name.toLowerCase() === formData.name.trim().toLowerCase())) {
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
          
          {/* Nota: Solo se puede crear con nombre por ahora */}
          <div className="warning-message" style={{
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#ffc107'
          }}>
            <strong>Nota:</strong> Por ahora solo se puede crear categorías con nombre. 
            Los campos de descripción e imagen no están disponibles en el modelo del backend.
          </div>
          
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
            <label htmlFor="description">Descripción (No disponible)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Campo no disponible en el modelo actual"
              className="form-input"
              rows={4}
              disabled={true}
              style={{ opacity: 0.5 }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Imagen de la Categoría (No disponible)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input"
              disabled={true}
              style={{ opacity: 0.5 }}
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