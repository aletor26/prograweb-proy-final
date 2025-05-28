import { useParams } from 'react-router-dom';
import { Detalle } from '../../components/Detalles_producto/detalles_producto';
import './DetalleProducto.css';

const DetalleProducto = () => {
  const { id } = useParams();

  return (
    <div className="detalle-producto-container">
      <Detalle id={id} />
    </div>
  );
};

export default DetalleProducto;

