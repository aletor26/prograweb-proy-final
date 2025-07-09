const API_URL = 'postgres-cloud-pw.postgres.database.azure.com';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  active?: boolean;
}

// Obtener todas las categorías
export async function obtenerCategorias(): Promise<Categoria[]> {
  try {
    const res = await fetch(`${API_URL}/categorias`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al obtener categorías');
    }
    const data = await res.json();
    console.log('Datos crudos del backend (obtenerCategorias):', data);
    return data;
  } catch (error) {
    console.error('Error en obtenerCategorias:', error);
    throw error;
  }
}

// Obtener una categoría por ID
export async function obtenerCategoriaPorId(id: number): Promise<Categoria> {
  try {
    const res = await fetch(`${API_URL}/categorias/${id}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al obtener la categoría');
    }
    const data = await res.json();
    console.log('Datos crudos del backend (obtenerCategoriaPorId):', data);
    return data;
  } catch (error) {
    console.error('Error en obtenerCategoriaPorId:', error);
    throw error;
  }
}

// Crear una nueva categoría
export async function crearCategoria(data: {
  nombre: string;
  descripcion?: string;
  imagen?: string;
}) {
  try {
    const res = await fetch(`${API_URL}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al crear categoría');
    }

    return await res.json();
  } catch (error: any) {
    console.error('Error en crearCategoria:', error);
    throw error;
  }
}


// Actualizar una categoría existente
export async function actualizarCategoria(id: number, data: Partial<Categoria>): Promise<Categoria> {
  try {
    console.log('Enviando datos para actualizar categoría:', { id, data });
    
    // El modelo real solo tiene: id, nombre
    const backendData = {
      nombre: data.nombre
    };
    
    console.log('Datos transformados para backend:', backendData);
    
    const res = await fetch(`${API_URL}/categorias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al actualizar la categoría');
    }
    const result = await res.json();
    console.log('Respuesta de actualizar categoría:', result);
    return result;
  } catch (error) {
    console.error('Error en actualizarCategoria:', error);
    throw error;
  }
}

// Eliminar una categoría
export async function eliminarCategoria(id: number): Promise<{ mensaje: string }> {
  try {
    const res = await fetch(`${API_URL}/categorias/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al eliminar la categoría');
    }
    const result = await res.json();
    console.log('Respuesta de eliminar categoría:', result);
    return result;
  } catch (error) {
    console.error('Error en eliminarCategoria:', error);
    throw error;
  }
}

export async function obtenerProductosPorCategoria(categoriaId: number) {
  const res = await fetch(`http://localhost:3000/categorias/${categoriaId}/productos`);
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
    serie: producto.serie || null,
    stock: producto.stock || 0,
    createdAt: producto.createdAt,
    updatedAt: producto.updatedAt
  }));
}

// Función de test para verificar endpoints
export async function testEndpoints() {
  console.log('=== TESTING ENDPOINTS ===');
  
  try {
    // Test GET /categorias
    console.log('1. Probando GET /categorias...');
    const res1 = await fetch(`${API_URL}/categorias`);
    console.log('Status:', res1.status);
    const data1 = await res1.json();
    console.log('Datos:', data1);
    
    if (data1.length > 0) {
      const firstCategory = data1[0];
      console.log('2. Probando GET /categorias/' + firstCategory.id + '...');
      const res2 = await fetch(`${API_URL}/categorias/${firstCategory.id}`);
      console.log('Status:', res2.status);
      const data2 = await res2.json();
      console.log('Datos:', data2);
      
      console.log('3. Probando PUT /categorias/' + firstCategory.id + '...');
      const res3 = await fetch(`${API_URL}/categorias/${firstCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: (firstCategory.nombre || 'Test') + ' (Updated)'
        }),
      });
      console.log('Status:', res3.status);
      const data3 = await res3.json();
      console.log('Datos:', data3);
    }
  } catch (error) {
    console.error('Error en test:', error);
  }
}