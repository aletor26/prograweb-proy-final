
import axios from 'axios';

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
  const res = await axios.get<Categoria[]>(`${API_URL}/categorias`);
  return res.data;
}

// Obtener una categoría por ID
export async function obtenerCategoriaPorId(id: number): Promise<Categoria> {
  const res = await axios.get<Categoria>(`${API_URL}/categorias/${id}`);
  return res.data;
}

// Crear una nueva categoría
export async function crearCategoria(data: Omit<Categoria, 'id' | 'active'>): Promise<Categoria> {
  const res = await axios.post<Categoria>(`${API_URL}/categorias`, data);
  return res.data;
}

// Actualizar una categoría existente
export async function actualizarCategoria(id: number, data: Partial<Categoria>): Promise<Categoria> {
  const res = await axios.put<Categoria>(`${API_URL}/categorias/${id}`, data);
  return res.data;
}

// Eliminar una categoría
export async function eliminarCategoria(id: number): Promise<{ mensaje: string }> {
  const res = await axios.delete<{ mensaje: string }>(`${API_URL}/categorias/${id}`);
  return res.data;
}