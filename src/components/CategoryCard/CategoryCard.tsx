import { Link } from 'react-router-dom';
import './CategoryCard.css';

interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/category/${category.id}`} className="category-card">
      <div className="category-card-container">
        <img
          src={category.image}
          alt={category.name}
          className="category-card-image"
        />
        <div className="category-card-overlay">
          <div className="category-card-content">
            <h3 className="category-card-title">
              {category.name}
            </h3>
            <p className="category-card-description">
              {category.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard; 