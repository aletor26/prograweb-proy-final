import { useEffect, useState } from 'react';
import { obtenerProducto } from '../../services/productoservicio';

export function DetalleProducto({ id }: { id: string | number | undefined }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await obtenerProducto(Number(id));
        setProduct(data);
      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Cargando producto...</div>;
  if (error || !product) return <div>Producto no encontrado</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} style={{ width: '300px' }} />
      <p><strong>Categoría:</strong> {product.categoryId}</p>
      <p>{product.description}</p>
      <p><strong>Precio:</strong> S/. {product.price}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
    </div>
  );
}
