import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearCategoria, obtenerCategorias } from '../../../services/categoriaservicio';
import './AddCategory.css';

const AddCategory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    setIsSubmitting(true);
    try {
      const categorias = await obtenerCategorias();
      const yaExiste = categorias.some(
        (cat: any) => cat.nombre?.toLowerCase() === formData.nombre.trim().toLowerCase()
      );

      if (yaExiste) {
        setError('Ya existe una categoría con este nombre');
        setIsSubmitting(false);
        return;
      }

      await crearCategoria({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        imagen: formData.imagen.trim()
      });

      navigate('/admin/categories');
    } catch (e: any) {
      console.error('Error al crear la categoría:', e);
      setError(e.message || 'Error al crear la categoría');
    }
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            <label htmlFor="nombre">Nombre de la Categoría *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Vinos Tintos"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Ej: Vinos de uva tinta, crianza en barrica..."
              className="form-input"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imagen">URL de la Imagen</label>
            <input
              type="text"
              id="imagen"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="https://..."
              className="form-input"
            />
            {formData.imagen && (
              <img
                src={formData.imagen}
                alt="Vista previa"
                style={{ maxWidth: 120, marginTop: 8, borderRadius: 8 }}
              />
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
