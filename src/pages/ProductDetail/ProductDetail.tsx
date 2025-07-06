import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerProducto, actualizarProducto } from '../../services/productoservicio';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  active?: boolean;
  serie?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
  details?: {
    brand?: string;
    origin?: string;
    volume?: string;
    alcoholContent?: string;
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
    serie: '',
    stock: '',
    active: true
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await obtenerProducto(Number(id));
        setProduct(data);
        setFormData({
          name: data.name || '',
          price: data.price?.toString() || '',
          image: data.image || '',
          category: data.category || '',
          description: data.description || '',
          serie: data.serie || '',
          stock: data.stock?.toString() || '',
          active: data.active !== false
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre del producto es requerido');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    if (!formData.image.trim()) {
      setError('La URL de la imagen es requerida');
      return;
    }

    if (!formData.category.trim()) {
      setError('La categoría es requerida');
      return;
    }

    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return;
    }

    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      image: formData.image.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      serie: formData.serie?.trim() || null,
      stock: formData.stock ? parseInt(formData.stock) : 0,
      active: formData.active
    };

    try {
      setSaving(true);
      setError(null);

      await actualizarProducto(Number(id), productData);
      
      // Actualizar el producto local
      if (product) {
        setProduct({
          ...product,
          ...productData,
          serie: productData.serie || undefined
        });
      }

      setShowMessage(true);
      setIsEditing(false);

      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Error al actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  // Si el producto está inactivo y no es admin, no mostrar
  if (!product.active && !isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Producto no disponible</h2>
        <p className="text-gray-600">Este producto no está disponible actualmente.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {showMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ¡Producto actualizado exitosamente!
        </div>
      )}

      {/* Header con acciones de admin */}
      {isAdmin && (
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Producto' : 'Detalle del Producto'}
          </h1>
          <div className="flex gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                Editar
              </button>
            )}
            <button
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      )}

      {isEditing && isAdmin ? (
        // Formulario de edición para admin
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (S/.) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serie
              </label>
              <input
                type="text"
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Producto Activo
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de la Imagen *
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.image && (
              <div className="mt-2">
                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      ) : (
        // Vista normal del producto
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
              {isAdmin && (
                <p className={`text-sm font-medium ${product.active ? 'text-green-600' : 'text-red-600'}`}>
                  Estado: {product.active ? 'Activo' : 'Inactivo'}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">{product.description}</p>

              {/* Información adicional para admin */}
              {isAdmin && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  {product.serie && (
                    <div>
                      <p className="font-semibold text-sm">Serie</p>
                      <p className="text-gray-600 text-sm">{product.serie}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">Stock</p>
                    <p className="text-gray-600 text-sm">{product.stock || 0} unidades</p>
                  </div>
                  {product.createdAt && (
                    <div>
                      <p className="font-semibold text-sm">Creado</p>
                      <p className="text-gray-600 text-sm">{new Date(product.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                  {product.updatedAt && (
                    <div>
                      <p className="font-semibold text-sm">Actualizado</p>
                      <p className="text-gray-600 text-sm">{new Date(product.updatedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )}

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

            {/* Solo mostrar carrito para usuarios normales */}
            {!isAdmin && (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;