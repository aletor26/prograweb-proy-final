import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerCategoriaPorId } from '../../services/categoriaservicio';
import type { Categoria } from '../../services/categoriaservicio';
import './CategoryCard.css';

interface CategoryCardProps {
  categoryId: number;
}

const CategoryCard = ({ categoryId }: CategoryCardProps) => {
  const [category, setCategory] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    obtenerCategoriaPorId(categoryId)
      .then((cat) => {
        setCategory(cat);
        setError(null);
      })
      .catch((err) => {
        setError(`Error al cargar la categoría: ${err.message}`);
        setCategory(null);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <div className="category-card">Cargando...</div>;
  if (error || !category) return <div className="category-card">{error || 'No encontrada'}</div>;

  return (
    <Link to={`/category/${category.id}`} className="category-card">
      <div className="category-card-container">
        <img
          src={category.image || '/placeholder.jpg'}
          alt={category.name}
          className="category-card-image"
        />
        <div className="category-card-overlay">
          <div className="category-card-content">
            <h3 className="category-card-title">
              {category.name}
            </h3>
            <p className="category-card-description">
              {category.description || ''}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;