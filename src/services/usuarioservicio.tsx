const API_URL = "backend-cloud-proyecto-c7gng2dehwezhhh3.canadacentral-01.azurewebsites.net";

// ==================== ADMIN - GESTIÓN DE USUARIOS ====================

// OBTENER LISTADO DE USUARIOS CON FILTROS
export async function getUsuariosAdmin(params: {
  id?: string | number;
  nombre?: string;
  apellido?: string;
  estadoid?: number;
  page?: number;
  limit?: number;
} = {}) {
  const queryParams = new URLSearchParams();
  
  // Agregar parámetros solo si están definidos
  if (params.id !== undefined) queryParams.append('id', params.id.toString());
  if (params.nombre) queryParams.append('nombre', params.nombre);
  if (params.apellido) queryParams.append('apellido', params.apellido);
  if (params.estadoid !== undefined) queryParams.append('estadoid', params.estadoid.toString());
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
  
  const url = `${API_URL}/admin/usuarios${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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

// OBTENER ESTADÍSTICAS DEL DASHBOARD
export async function getDashboardStats(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const url = `${API_URL}/admin/dashboard${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw await res.json();
  return res.json();
}
