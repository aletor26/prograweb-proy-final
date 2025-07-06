const API_URL = "http://localhost:3000";

// ==================== ADMIN - GESTIÓN DE PEDIDOS ====================

// OBTENER LISTADO DE PEDIDOS CON FILTROS
export async function getPedidosAdmin(params: any = {}) {
  const queryString = new URLSearchParams(params).toString();
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
