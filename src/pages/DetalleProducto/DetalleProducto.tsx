import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerProducto } from '../../services/productoservicio';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const DetalleProducto = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID de producto no proporcionado');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await obtenerProducto(Number(id));
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Cargando producto...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>{product.category}</p>
      <p>{product.description}</p>
      <p>S/. {product.price}</p>
      {/* Puedes mostrar más campos si existen */}
    </div>
  );
};

export default DetalleProducto;
