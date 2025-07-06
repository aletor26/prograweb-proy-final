const API_URL = 'http://localhost:3000';

export interface Categoria {
  id: number;
  name: string;
  description?: string;
  image?: string;
  active?: boolean;
}

// Obtener todas las categorías
export async function obtenerCategorias(): Promise<Categoria[]> {
  const res = await fetch(`${API_URL}/categorias`);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return res.json();
}

// Obtener una categoría por ID
export async function obtenerCategoriaPorId(id: number): Promise<Categoria> {
  const res = await fetch(`${API_URL}/categorias/${id}`);
  if (!res.ok) throw new Error('Error al obtener la categoría');
  return res.json();
}

// Crear una nueva categoría
export async function crearCategoria(data: Omit<Categoria, 'id' | 'active'>): Promise<Categoria> {
  const res = await fetch(`${API_URL}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear la categoría');
  return res.json();
}

// Actualizar una categoría existente
export async function actualizarCategoria(id: number, data: Partial<Categoria>): Promise<Categoria> {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar la categoría');
  return res.json();
}

// Eliminar una categoría
export async function eliminarCategoria(id: number): Promise<{ mensaje: string }> {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar la categoría');
  return res.json();
}