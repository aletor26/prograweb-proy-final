const API_URL = "http://localhost:3000";

// ==================== ADMIN - GESTIÓN DE USUARIOS ====================

// OBTENER LISTADO DE USUARIOS CON FILTROS
export async function getUsuariosAdmin(params: any = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/admin/usuarios${queryString ? `?${queryString}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw await res.json();
  return res.json();
}

// OBTENER DETALLE DE USUARIO Y SUS ÓRDENES
export async function getUsuarioAdmin(id: number) {
  const res = await fetch(`${API_URL}/admin/usuarios/${id}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// DESACTIVAR USUARIO
export async function desactivarUsuario(id: number) {
  const res = await fetch(`${API_URL}/admin/usuarios/${id}/desactivar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ACTIVAR USUARIO
export async function activarUsuario(id: number) {
  const res = await fetch(`${API_URL}/admin/usuarios/${id}/activar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
