const API_URL = "http://localhost:3000";

// ==================== ADMIN - GESTIÓN DE PEDIDOS ====================

// OBTENER LISTADO DE PEDIDOS CON FILTROS
export async function getPedidosAdmin(params: any = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/admin/pedidos${queryString ? `?${queryString}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw await res.json();
  const data = await res.json();
  
  // Transformar los datos para que coincidan con el formato esperado por el frontend
  const transformedData = {
    ...data,
    pedidos: (data.rows || data.pedidos || []).map((pedido: any) => ({
      ...pedido,
      cliente: {
        nombre: pedido.Cliente?.Usuario?.nombre || pedido.cliente?.nombre,
        apellido: pedido.Cliente?.Usuario?.apellido || pedido.cliente?.apellido,
        email: pedido.Cliente?.Usuario?.correo || pedido.cliente?.email,
        telefono: pedido.Cliente?.telefono || pedido.cliente?.telefono,
        direccion: pedido.Cliente?.direccion || pedido.cliente?.direccion
      },
      estado: pedido.Estado_Pedido?.id || pedido.estadoPedidoId || pedido.estado
    }))
  };
  
  return transformedData;
}

// OBTENER DETALLE COMPLETO DE UN PEDIDO
export async function getPedidoAdmin(id: number) {
  const res = await fetch(`${API_URL}/admin/pedidos/${id}`);
  
  if (!res.ok) {
    const errorData = await res.json();
    console.error('❌ Error al obtener pedido admin:', errorData);
    throw errorData;
  }
  
  const data = await res.json();
  console.log('📦 Datos recibidos del backend para pedido admin:', data);
  
  // Transformar los datos para que coincidan con el formato esperado por el frontend
  const transformedData = {
    ...data,
    items: (data.Productos || []).map((producto: any) => ({
      id: producto.id,
      name: producto.nombre,
      quantity: producto.Pedido_Producto?.cantidad || 1,
      price: producto.precio,
      nombre: producto.nombre,
      cantidad: producto.Pedido_Producto?.cantidad || 1
    })),
    total: data.precio_total,
    fecha: data.fecha_pedido,
    cliente: {
      nombre: data.Cliente?.Usuario?.nombre,
      apellido: data.Cliente?.Usuario?.apellido,
      email: data.Cliente?.Usuario?.correo,
      telefono: data.Cliente?.telefono,
      direccion: data.Cliente?.direccion
    },
    estado: data.Estado_Pedido?.id || data.estadoPedidoId
  };
  
  return transformedData;
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
