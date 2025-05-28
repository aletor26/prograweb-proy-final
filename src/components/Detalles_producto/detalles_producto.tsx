import { useMemo } from 'react';
import { products } from '../../data/products';

export function Detalle({ id }: { id: string | number | undefined }) {
  const product = useMemo(() => {
    return products.find(p => String(p.id) === String(id)) || null;
  }, [id]);

  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div>
      <h2>DETALLE DE: {product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>{product.category}</p>
      <p>{product.description}</p>
      <p>S/. {product.price}</p>
      {/* Puedes mostrar más campos si existen */}
    </div>
  );
}