const API_URL = "http://localhost:3000";

// LOGIN
export async function login(correo: string, clave: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, clave }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// REGISTRO
export async function register(data: {
  nombre: string;
  apellido: string;
  correo: string;
  dni: string;
  clave: string;
  direccion: string;
  telefono: string;
  
}) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// RESUMEN DE ÓRDENES DEL USUARIO (paginado)
export async function getPedidosCliente(clienteId: number, page = 1, limit = 10) {
  const res = await fetch(`${API_URL}/clientes/${clienteId}/pedidos?page=${page}&limit=${limit}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// CARRITO DE COMPRAS (simulado)
export async function getCarrito(clienteId: number) {
  const res = await fetch(`${API_URL}/carrito/${clienteId}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// AGREGAR AL CARRITO
export async function agregarAlCarrito(productoId: number) {
  const res = await fetch(`${API_URL}/carrito`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productoId }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ACTUALIZAR CANTIDAD EN CARRITO
export async function actualizarCantidadCarrito(clienteId: number, itemId: number, cantidad: number) {
  const res = await fetch(`${API_URL}/carrito/${clienteId}/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cantidad }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ELIMINAR ITEM DEL CARRITO
export async function eliminarItemCarrito(clienteId: number, itemId: number) {
  const res = await fetch(`${API_URL}/carrito/${clienteId}/${itemId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// CHECKOUT (obtener resumen)
export async function getCheckout(clienteId: number) {
  const res = await fetch(`${API_URL}/checkout/${clienteId}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// COMPLETAR ORDEN (checkout)
export async function completarOrden(data: any) {
  const res = await fetch(`${API_URL}/checkout/completarorden`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getPedidoCliente(_clienteId: number, pedidoId: number) {
  const res = await fetch(`${API_URL}/pedidos/${pedidoId}`);
  if (!res.ok) throw await res.json();
  return res.json();
}
  