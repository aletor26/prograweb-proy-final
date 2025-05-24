import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCategory.css';

const AddCategory = () => {
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to save the new category
    console.log('New category data:', categoryData);
    // Navigate back to categories list after saving
    navigate('/admin/categories');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="add-category-container">
      <div className="add-category-card">
        <h1>Agregar Nueva Categoría</h1>
        
        <form onSubmit={handleSubmit} className="add-category-form">
          <div className="form-group">
            <label htmlFor="name">Nombre de la Categoría</label>
            <input
              type="text"
              id="name"
              name="name"
              value={categoryData.name}
              onChange={handleChange}
              placeholder="Ej: Cervezas Artesanales"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={categoryData.description}
              onChange={handleChange}
              placeholder="Describe la categoría..."
              rows={4}
            />
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