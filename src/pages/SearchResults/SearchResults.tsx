import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface Category {
  id: number;
  name: string;
  count: number;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    // TODO: Fetch data from API
    // Mockup data for now
    setProducts([
      { id: 1, name: "Vino Tinto Reserva", price: 59.99, image: "/wines/red-wine.jpg", category: "Vinos" },
      // ... más productos
    ]);

    setCategories([
      { id: 1, name: "Vinos", count: 25 },
      { id: 2, name: "Piscos", count: 15 },
      { id: 3, name: "Rones", count: 10 },
    ]);
  }, [query]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // TODO: Implementar ordenamiento
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    // TODO: Implementar filtrado
  };

  return (
    <div className="flex gap-8">
      {/* Filtros */}
      <aside className="w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Categorías</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleCategoryFilter(null)}
                className={`w-full text-left py-2 px-3 rounded ${
                  selectedCategory === null ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                }`}
              >
                Todas las categorías
              </button>
            </li>
            {categories.map(category => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryFilter(category.id.toString())}
                  className={`w-full text-left py-2 px-3 rounded flex justify-between items-center ${
                    selectedCategory === category.id.toString() ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">({category.count})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Resultados */}
      <div className="flex-1">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Resultados para "{query}"
          </h1>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="relevance">Más relevantes</option>
            <option value="price_asc">Precio: Menor a mayor</option>
            <option value="price_desc">Precio: Mayor a menor</option>
            <option value="name_asc">Nombre: A-Z</option>
            <option value="name_desc">Nombre: Z-A</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No se encontraron resultados</h2>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda o navega por nuestras categorías
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 