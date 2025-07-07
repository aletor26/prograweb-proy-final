import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPedidoCliente } from '../../services/clienteservicios';
import './OrderDetail.css';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  numero: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingDetails: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    phone: string;
  };
  shippingMethod: string;
  paymentMethod: string;
}

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user?.id || !orderId) return setIsLoading(false);
      try {
        const data = await getPedidoCliente(Number(user.id), Number(orderId));
        console.log('Datos del pedido recibidos:', data); // Para debug
        
        setOrder({
          id: data.id,
          numero: data.numero,  
          date: data.fecha_pedido,
          total: data.precio_total,
          status: data.Estado_Pedido?.nombre || 'Desconocido',
          items: (data.Productos || []).map((item: any) => ({
            id: item.id,
            name: item.nombre,
            quantity: item.pedido_producto?.cantidad || 1, // Usar la cantidad de la tabla intermedia
            price: item.precio
          })),
          shippingDetails: {
            fullName: data.cliente?.usuario
              ? `${data.cliente.usuario.nombre} ${data.cliente.usuario.apellido || ''}`
              : '',
            email: data.cliente?.usuario?.correo || data.correo || '',
            address: data.direccion || data.cliente?.direccion || '',
            city: data.cliente?.ciudad || '',
            phone: data.cliente?.usuario?.telefono || ''
          },
          shippingMethod: data.Envio?.tipo || '',
          paymentMethod: data.Pago?.nombre || ''
        });
      } catch (error) {
        console.error('Error al obtener el pedido:', error);
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, user?.id]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'En proceso';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getShippingMethodText = (method: Order['shippingMethod']) => {
    return method === 'standard' ? 'Envío estándar (3-5 días)' : 'Envío express (1-2 días)';
  };

  const getPaymentMethodText = (method: Order['paymentMethod']) => {
    return method === 'Qr' ? 'Pago con QR' : 'Tarjeta de crédito';
  };

  if (isLoading) {
    return (
      <div className="order-detail-container">
        <div className="order-detail-loading">
          <p>Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-container">
        <div className="order-detail-error">
          <h2>Pedido no encontrado</h2>
          <button onClick={() => navigate('/orders')} className="back-button">
            Volver a mis pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-card">
        <div className="order-detail-header">
          <div className="order-detail-title">
            <h1>Pedido #{order.numero}</h1>
            <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
          </div>
          <div className="order-status-section">
            <span className={`order-status`}>{order.status}</span>
          </div>
        </div>

        <div className="order-info-section">
          <h2>Detalles de envío</h2>
          <div className="shipping-details">
            <p><strong>Nombre:</strong> {order.shippingDetails.fullName}</p>
            <p><strong>Email:</strong> {order.shippingDetails.email}</p>
            <p><strong>Dirección:</strong> {order.shippingDetails.address}</p>
            <p><strong>Ciudad:</strong> {order.shippingDetails.city}</p>
            <p><strong>Teléfono:</strong> {order.shippingDetails.phone}</p>
            <p><strong>Método de envío:</strong> {getShippingMethodText(order.shippingMethod)}</p>
          </div>
        </div>

        <div className="order-info-section">
          <h2>Método de pago</h2>
          <p>{getPaymentMethodText(order.paymentMethod)}</p>
        </div>

        <div className="order-items-section">
          <h2>Productos</h2>
          <div className="order-items-list">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">S/ {item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-total-section">
          <div className="order-total">
            <span>Total</span>
            <span>S/ {order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="order-actions">
          <button onClick={() => navigate('/orders')} className="back-button">
            Volver a mis pedidos
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 