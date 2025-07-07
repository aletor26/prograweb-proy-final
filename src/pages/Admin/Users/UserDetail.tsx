import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUsuarioAdmin } from "../../../services/usuarioservicio";
import UserDetailView from '../../../components/UserDetail/UserDetailView';
import UserOrdersList from '../../../components/UserDetail/UserOrdersList';
// import UserOrdersList from "../../../components/UserDetail/UserOrdersList"; // Si quieres mostrar órdenes

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getUsuarioAdmin(Number(id));
        setUser(response.usuario || response);
      } catch (err: any) {
        console.error('Error al cargar usuario:', err);
        setError(err.message || 'Error al cargar usuario');
        
        // Fallback a localStorage si hay error
        const storedUsers = localStorage.getItem("users");
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const found = users.find((u: any) => u.id === id);
          setUser(found || null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (isLoading) {
    return (
      <div>
        <div className="loading">Cargando usuario...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="error">Error: {error}</div>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h2>Usuario no encontrado</h2>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Detalle de Usuario</h2>
      <UserDetailView user={user} />
      <UserOrdersList email={user.email} />
      {/* <UserOrdersList email={user.email} /> */}
      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
};

export default UserDetail;
