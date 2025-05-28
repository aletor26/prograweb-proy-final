import { useMemo } from 'react';
import { offers } from '../../data/offers';

export function Detalle({ id }: { id: string | number | undefined }) {
  const offer = useMemo(() => {
    return offers.find(p => String(p.id) === String(id)) || null;
  }, [id]);

  if (!offer) return <div>Producto no encontrado</div>;

  return (
    <div>
      <h2>DETALLE DE: {offer.name}</h2>
      <img src={offer.image} alt={offer.name} />
      <p>{offer.category}</p>
      <p>{offer.description}</p>
      <p>S/. {offer.price}</p>
      {/* Puedes mostrar más campos si existen */}
    </div>
  );
}
