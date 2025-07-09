import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerProducto } from '../../services/productoservicio';
import { useCart } from '../../context/CartContext'; 
import { useNavigate } from 'react-router-dom'; 
import './DetalleProducto.css';
import { obtenerCategoriaPorId } from '../../services/categoriaservicio';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string; 
  description: string;
  stock: number;
}


const DetalleProducto = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();
 

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await obtenerProducto(Number(id));
        let categoryName = '';
        if (data.categoryId) {
          try {
            const categoria = await obtenerCategoriaPorId(data.categoryId);
            categoryName = categoria.nombre;
          } catch {
            categoryName = 'Sin categoría';
          }
        } else {
          categoryName = 'Sin categoría';
        }
        setProduct({ ...data, category: categoryName });
      } catch (err) {
        setError('No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-20">Cargando producto...</div>;
  if (error || !product) return <div className="text-center py-20 text-red-600">{error || 'Producto no encontrado'}</div>;

 return (
  <div className="detalle-producto-wrapper">
    <div className="detalle-producto-container-v2">
      {/* Imagen */}
      <div className="detalle-producto-imagen">
        <img src={product.image} alt={product.name} />
      </div>

      {/* Información */}
      <div className="detalle-producto-info">
        <h2>{product.name}</h2>
        <p className="precio">S/. {product.price.toFixed(2)}</p>
        <p className="descripcion">{product.description}</p>
        <p className="stock">Stock disponible: {product.stock}</p>

        {/* Cantidad y botones */}
        <div className="detalle-producto-acciones">
          <div className="cantidad-selector">
            <button onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
          </div>

          <div className="botones">
          <button
            className="btn-añadir"
            onClick={() => {
              if (product) {
                addToCart(product, quantity);
              }
            }}
          >
            Añadir a la cesta
          </button>

          <button
            className="btn-comprar"
            onClick={() => {
              if (product) {
                addToCart(product, quantity);
                navigate('/cart');
              }
            }}
          >
            Comprar ahora
          </button>
        </div>

        </div>
      </div>
    </div>
  </div>
);
}

export default DetalleProducto;
