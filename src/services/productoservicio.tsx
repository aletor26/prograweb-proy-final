

const API_URL = "http://localhost:3000";

// Obtener todos los productos
export async function obtenerProductos() {
  const res = await fetch(`${API_URL}/productos`);
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