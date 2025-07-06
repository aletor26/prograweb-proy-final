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
  // stock y details pueden no existir en todos los productos
  stock?: number;
  details?: {
    brand?: string;
    origin?: string;
    volume?: string;
    alcoholContent?: string;
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
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

  const handleAddToCart = () => {
    // TODO: Implementar lógica de agregar al carrito
    if (product) {
      console.log(`Agregando ${quantity} unidades del producto ${product.id} al carrito`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
        <p className="text-gray-600">El producto que buscas no existe o no está disponible.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-primary-600">
              S/ {product.price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">{product.description}</p>

            {product.details && (
              <div className="grid grid-cols-2 gap-4">
                {product.details.brand && (
                  <div className="space-y-2">
                    <p className="font-semibold">Marca</p>
                    <p className="text-gray-600">{product.details.brand}</p>
                  </div>
                )}
                {product.details.origin && (
                  <div className="space-y-2">
                    <p className="font-semibold">Origen</p>
                    <p className="text-gray-600">{product.details.origin}</p>
                  </div>
                )}
                {product.details.volume && (
                  <div className="space-y-2">
                    <p className="font-semibold">Volumen</p>
                    <p className="text-gray-600">{product.details.volume}</p>
                  </div>
                )}
                {product.details.alcoholContent && (
                  <div className="space-y-2">
                    <p className="font-semibold">Contenido de alcohol</p>
                    <p className="text-gray-600">{product.details.alcoholContent}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-6 border-t">
            <div className="flex items-center space-x-4 mb-4">
              <label htmlFor="quantity" className="font-semibold">
                Cantidad:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded-lg px-4 py-2"
                disabled={!product.stock}
              >
                {[...Array(Math.min(10, product.stock || 1))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-500">
                {product.stock ? `${product.stock} unidades disponibles` : 'Stock no disponible'}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              disabled={!product.stock}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;