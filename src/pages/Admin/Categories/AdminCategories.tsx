import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import BotonEditar from '../../../components/BotonEditar/BotonEditar';
import './AdminCategories.css';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  active: boolean;
}

type FilterType = 'name' | 'description' | 'id';

const filterLabels: Record<FilterType, string> = {
  name: 'Nombre',
  description: 'Descripción',
  id: 'ID'
};

const AdminCategories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('name');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
    setIsLoading(false);
  }, []);

  // Cierra el menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setShowFilterMenu(false);
      }
    }
    if (showFilterMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterMenu]);

  const filteredCategories = categories.filter(category => {
    const searchLower = searchTerm.toLowerCase();
    switch (filterType) {
      case 'name':
        return category.name.toLowerCase().includes(searchLower);
      case 'description':
        return category.description.toLowerCase().includes(searchLower);
      case 'id':
        return category.id.toLowerCase().includes(searchLower);
      default:
        return false;
    }
  });

  const handleEditCategory = (categoryId: string) => {
    navigate(`/admin/categories/${categoryId}/edit`);
  };

  const handleFilterTypeChange = (type: FilterType) => {
    setFilterType(type);
    setShowFilterMenu(false);
  };

  if (isLoading) {
    return (
      <div className="admin-categories">
        <div className="admin-categories-loading">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="admin-categories">
      <div className="admin-categories-header">
        <h1>Gestión de Categorías</h1>
        <div className="admin-categories-controls">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              className="admin-categories-filter-btn"
              title="Filtrar por"
              onClick={() => setShowFilterMenu((prev) => !prev)}
            >
              <i className="fas fa-filter"></i>
              <span style={{ marginLeft: 6 }}>{filterLabels[filterType]}</span>
              <i className="fas fa-chevron-down" style={{ marginLeft: 4, fontSize: '0.9em' }}></i>
            </button>
            {showFilterMenu && (
              <div
                ref={filterMenuRef}
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: '#222',
                  border: '1px solid #c8a97e',
                  borderRadius: 6,
                  zIndex: 10,
                  minWidth: 120,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                <button
                  className="admin-categories-filter-btn"
                  style={{
                    width: '100%',
                    background: filterType === 'name' ? '#c8a97e' : 'none',
                    color: filterType === 'name' ? '#222' : '#c8a97e',
                    borderRadius: '6px 6px 0 0'
                  }}
                  onClick={() => handleFilterTypeChange('name')}
                >
                  Nombre
                </button>
                <button
                  className="admin-categories-filter-btn"
                  style={{
                    width: '100%',
                    background: filterType === 'description' ? '#c8a97e' : 'none',
                    color: filterType === 'description' ? '#222' : '#c8a97e'
                  }}
                  onClick={() => handleFilterTypeChange('description')}
                >
                  Descripción
                </button>
                <button
                  className="admin-categories-filter-btn"
                  style={{
                    width: '100%',
                    background: filterType === 'id' ? '#c8a97e' : 'none',
                    color: filterType === 'id' ? '#222' : '#c8a97e',
                    borderRadius: '0 0 6px 6px'
                  }}
                  onClick={() => handleFilterTypeChange('id')}
                >
                  ID
                </button>
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder={`Buscar por ${filterLabels[filterType].toLowerCase()}...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="admin-categories-search-input"
            style={{ marginLeft: 8 }}
          />
          <button
            className="admin-categories-add-button"
            onClick={() => navigate('/admin/categories/new')}
          >
            + Agregar Categoría
          </button>
        </div>
      </div>
      <div className="admin-categories-section">
        <div className="admin-categories-list">
          {filteredCategories.length === 0 ? (
            <div className="admin-categories-no-categories">
              <p>No hay categorías disponibles.</p>
            </div>
          ) : (
            filteredCategories.map(category => (
              <div key={category.id} className={`admin-category-card${!category.active ? ' inactive' : ''}`}>
                <div className="admin-category-header">
                  <h2>{category.name}</h2>
                </div>
                <div className="admin-category-info">
                  <p>{category.description}</p>
                  <p><strong>{category.productCount}</strong> productos</p>
                </div>
                <div className="admin-category-actions">
                  <BotonEditar onClick={() => handleEditCategory(category.id)} label="" />
                  {/* Otros botones de acción aquí */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;