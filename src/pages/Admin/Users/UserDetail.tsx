import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserDetailView from '../../../components/UserDetail/UserDetailView';
import UserOrdersList from '../../../components/UserDetail/UserOrdersList';
// import UserOrdersList from "../../../components/UserDetail/UserOrdersList"; // Si quieres mostrar órdenes

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      console.log("Usuarios en localStorage:", users);
      console.log("Buscando usuario con id:", id);
      const found = users.find((u: any) => u.id === id);
      setUser(found || null);
    }
  }, [id]);

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
