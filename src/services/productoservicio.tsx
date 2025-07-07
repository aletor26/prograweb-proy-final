
const API_URL = "http://localhost:3000";

// Obtener todos los productos
export async function obtenerProductos() {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// Obtener productos con filtros y paginación (para admin)
export async function obtenerProductosAdmin(params: any = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/admin/productos${queryString ? `?${queryString}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw await res.json();
  return res.json();
}

// Obtener detalle de un producto
export async function obtenerProducto(id: number) {
  const res = await fetch(`${API_URL}/productos/${id}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// Crear un nuevo producto
export async function crearProducto(data: any) {
  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Actualizar un producto
export async function actualizarProducto(id: number, data: any) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
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
  const res = await fetch(`${API_URL}/admin/productos/${id}/toggle-activo`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activo }),
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