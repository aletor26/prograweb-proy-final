const API_URL = "http://localhost:3000";

// ==================== ADMIN - GESTIÓN DE PEDIDOS ====================

// OBTENER LISTADO DE PEDIDOS CON FILTROS
export async function getPedidosAdmin(params: any = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.numero) queryParams.append('numero', params.numero);
  if (params.nombre) queryParams.append('nombre', params.nombre);
  if (params.apellido) queryParams.append('apellido', params.apellido);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  const url = `${API_URL}/admin/pedidos${queryString ? `?${queryString}` : ''}`;
  
  const res = await fetch(url);
  if (!res.ok) throw await res.json();
  return res.json();
}

// OBTENER DETALLE COMPLETO DE UN PEDIDO
export async function getPedidoAdmin(id: number) {
  const res = await fetch(`${API_URL}/admin/pedidos/${id}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// CANCELAR PEDIDO (ADMIN)
export async function cancelarPedidoAdmin(id: number) {
  const res = await fetch(`${API_URL}/admin/pedidos/${id}/cancelar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ==================== FUNCIONES AUXILIARES ====================

// OBTENER ESTADO DEL PEDIDO
export function obtenerEstadoTexto(estadoId: number) {
  const estados = {
    1: 'Pendiente',
    2: 'Cancelado',
    3: 'Procesando',
    4: 'Enviado',
    5: 'Entregado',
  };
  return estados[estadoId as keyof typeof estados] || 'Desconocido';
}
