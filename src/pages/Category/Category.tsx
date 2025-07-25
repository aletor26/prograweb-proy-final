import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerProductos } from '../../services/productoservicio';
import { obtenerCategorias } from '../../services/categoriaservicio';
import ProductCard from '../../components/ProductCard/ProductCard';
import '../../components/ProductCard/ProductCard.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  active?: boolean;
}

function normalize(str: string) {
  return str
    .normalize('NFD')
    .replace(/[^ -]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '');
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [allProducts, categorias] = await Promise.all([
          obtenerProductos(),
          obtenerCategorias()
        ]);
        const categoriasMap = Object.fromEntries(
          categorias.map((cat: any) => [cat.id, cat.nombre])
        );
        const productosConCategoria = allProducts.map((p: any) => ({
          ...p,
          category: categoriasMap[p.categoriaId] || 'Sin categoría'
        }));
        const filtered = productosConCategoria.filter(
          (p: any) =>
            p.category &&
            normalize(p.category) === normalize(category || '') &&
            p.active !== false
        );
        setProducts(filtered);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div>
      <h1>Productos de la categoría: {category}</h1>
      {products.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;