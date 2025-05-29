import { useState, useEffect, useRef } from 'react';
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
  image?: string;
}

type FilterType = 'name' | 'description' | 'id';

const filterLabels: Record<FilterType, string> = {
  name: 'Nombre',
  description: 'Descripción',
  id: 'ID'
};

// Categorías por defecto (igual que en AdminDashboard)
const DEFAULT_CATEGORIES = [
  {
    id: 'vinos',
    name: 'Vinos',
    description: 'Vinos tintos, blancos y rosados',
    productCount: 0,
    active: true
  },
  {
    id: 'piscos',
    name: 'Piscos',
    description: 'Piscos puros y acholados',
    productCount: 0,
    active: true
  },
  {
    id: 'whiskies',
    name: 'Whiskies',
    description: 'Whiskies de diferentes regiones',
    productCount: 0,
    active: true
  },
  {
    id: 'vodkas',
    name: 'Vodkas',
    description: 'Vodkas premium',
    productCount: 0,
    active: true
  },
  {
    id: 'tequilas',
    name: 'Tequilas',
    description: 'Tequilas blancos y reposados',
    productCount: 0,
    active: true
  },
  {
    id: 'rones',
    name: 'Rones',
    description: 'Rones añejos y blancos',
    productCount: 0,
    active: true
  },
  {
    id: 'gin',
    name: 'Gin',
    description: 'Ginebras premium',
    productCount: 0,
    active: true
  },
  {
    id: 'champagnes',
    name: 'Champagnes',
    description: 'Champagnes y espumantes',
    productCount: 0,
    active: true
  }
];

const AdminCategories = () => {
  useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('name');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let storedCategories = localStorage.getItem('categories');
    let categories: Category[] = storedCategories ? JSON.parse(storedCategories) : [];
    // Si no hay categorías o todas están inactivas, restaurar por defecto
    if (!storedCategories || categories.length === 0 || categories.every(cat => !cat.active)) {
      localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
      setCategories(DEFAULT_CATEGORIES);
    } else {
      setCategories(categories);
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

  const handleDeactivateCategory = (categoryId: string) => {
    const activeCategories = categories.filter(c => c.active);
    if (activeCategories.length === 1 && activeCategories[0].id === categoryId) {
      alert("Debe haber al menos una categoría activa.");
      return;
    }
    // ...desactivar normalmente
  };

  const handleDeleteCategory = (categoryId: string) => {
    const activeCategories = categories.filter(c => c.active && c.id !== categoryId);
    if (activeCategories.length === 0) {
      alert("Debe haber al menos una categoría activa.");
      return;
    }
    // Eliminar la categoría
    const updatedCategories = categories.filter(c => c.id !== categoryId);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    window.dispatchEvent(new Event('storage'));
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
              <div
                key={category.id}
                className={`admin-category-card${!category.active ? ' inactive' : ''}`}
                style={
                  category.image
                    ? {
                        backgroundImage: `url(${category.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative',
                      }
                    : {}
                }
              >
                <div
                  style={{
                    background: category.image ? 'rgba(24,24,24,0.75)' : 'none',
                    borderRadius: 8,
                    padding: '1rem',
                    height: '100%',
                  }}
                >
                  <div className="admin-category-header">
                    <h2>{category.name}</h2>
                  </div>
                  <div className="admin-category-info">
                    <p>{category.description}</p>
                    <p><strong>{category.productCount}</strong> productos</p>
                  </div>
                  <div className="admin-category-actions">
                    <BotonEditar onClick={() => handleEditCategory(category.id)} label="" />
                    <button
                      className="admin-categories-delete-btn"
                      title="Eliminar categoría"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
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