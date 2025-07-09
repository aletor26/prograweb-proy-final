const API_URL = "http://localhost:3000";

// Función de prueba para verificar conectividad
export async function testBackendConnection() {
  try {
    console.log('Testing backend connection...');
    const res = await fetch(`${API_URL}/productos`);
    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Backend error: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Backend is working, products endpoint response:', data);
    return true;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    throw error;
  }
}

// Obtener todos los productos
export async function obtenerProductos() {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw await res.json();
  const productos = await res.json();

  // Transformar los campos al formato esperado por el frontend
  return productos.map((producto: any) => ({
    id: producto.id,
    name: producto.nombre,
    description: producto.descripcion,
    price: producto.precio,
    image: producto.url_imagen || 'https://placehold.co/300x300',
    categoriaId: producto.categoriaId,
    active: producto.estadoId === 1,
    serie: producto.serie || null,
    stock: producto.stock || 0,
    createdAt: producto.createdAt,
    updatedAt: producto.updatedAt
  }));
}

// Obtener productos con filtros y paginación (para admin)
export async function obtenerProductosAdmin(params: any = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/admin/productos${queryString ? `?${queryString}` : ''}`;
    console.log('Fetching products from:', url);
    
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || 'Error al obtener productos');
    }
    
    const data = await res.json();
    console.log('Backend response:', data);
    
    // Transformar los campos del backend al formato esperado por el frontend
    const transformedProducts = (data.productos || []).map((producto: any) => ({
      id: producto.id,
      name: producto.nombre,
      description: producto.descripcion,
      price: producto.precio,
      image: producto.url_imagen || 'https://placehold.co/300x300',
      category: producto.categoriaId ? `Categoría ${producto.categoriaId}` : 'Sin categoría',
      active: producto.estadoId === 1,
      serie: producto.serie || null,
      stock: producto.stock || 0,
      createdAt: producto.createdAt,
      updatedAt: producto.updatedAt
    }));
    
    return {
      productos: transformedProducts,
      total: data.total || transformedProducts.length,
      pagina: data.pagina || 1,
      porPagina: data.porPagina || 10,
      totalPaginas: data.totalPaginas || 1
    };
  } catch (error) {
    console.error('Error in obtenerProductosAdmin:', error);
    throw error;
  }
}

// Obtener detalle de un producto
export async function obtenerProductosPorCategoria(categoriaId: number) {
  const res = await fetch(`${API_URL}/productos/por-categoria/${categoriaId}`);
  if (!res.ok) throw await res.json();

  const productos = await res.json();
  return productos.map((producto: any) => ({
    id: producto.id,
    name: producto.nombre,
    description: producto.descripcion,
    price: producto.precio,
    image: producto.url_imagen || 'https://placehold.co/300x300',
    categoryId: producto.categoriaId,
    active: producto.estadoId === 1,
    stock: producto.stock || 0
  }));
}


export async function crearProducto(data: any) {
  const backendData = {
    nombre: data.name,
    descripcion: data.description,
    precio: data.price,
    url_imagen: data.image,
    categoriaId: data.categoryId,
    estadoId: data.active ? 1 : 2,
    stock: data.stock ?? 0, // 👈 IMPORTANTE
  };

  console.log("📦 Enviando al backend:", backendData); // Añade esto para depurar

  const res = await fetch(`${API_URL}/admin/producto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backendData),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}



// Actualizar un producto
export async function actualizarProducto(id: number, data: any) {
  // Transformar campos del frontend al backend
  const backendData = {
    nombre: data.name,
    descripcion: data.description,
    precio: data.price,
    url_imagen: data.image,
    stock: data.stock ,// ✅ nuevo campo
    categoriaId: data.categoryId || 1,
    estadoId: data.active ? 1 : 2
  };

  
  const res = await fetch(`${API_URL}/admin/producto/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backendData),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Eliminar un producto
export async function eliminarProducto(id: number) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Activar/Desactivar un producto
export async function toggleProductoActivo(id: number, activo: boolean) {
  const endpoint = activo ? 'activar' : 'desactivar';
  const res = await fetch(`${API_URL}/admin/producto/${id}/${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Obtener estadísticas del dashboard
export async function obtenerEstadisticasDashboard(fechaInicio: string, fechaFin: string) {
  const params = new URLSearchParams({
    fechaInicio,
    fechaFin
  });
  const res = await fetch(`${API_URL}/admin/dashboard/estadisticas?${params}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// Obtener un solo producto por ID (detalle)
export async function obtenerProducto(id: number) {
  const res = await fetch(`${API_URL}/admin/producto/${id}`);
  if (!res.ok) throw await res.json();
  const producto = await res.json();

  return {
    id: producto.id,
    name: producto.nombre,
    description: producto.descripcion,
    price: producto.precio,
    image: producto.url_imagen || 'https://placehold.co/300x300',
    categoryId: producto.categoriaId,
    active: producto.estadoId === 1,
    stock: producto.stock || 0,
    createdAt: producto.createdAt,
    updatedAt: producto.updatedAt
  };
}
