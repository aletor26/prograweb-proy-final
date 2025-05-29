import React from "react";
import { Link } from "react-router-dom";

interface UserRowProps {
  user: {
    id: string;
    nombre?: string;
    apellido?: string;
    name?: string; // Para compatibilidad con usuarios antiguos
    email: string;
    activo?: boolean; // Puede no existir en usuarios antiguos
    role?: string;
  };
  onToggleActive: (id: string) => void;
  onDeleteUser: (id: string) => void;
  currentUserId: string | undefined;
}

const UserRow: React.FC<UserRowProps> = ({
  user,
  onToggleActive,
  onDeleteUser,
  currentUserId
}) => {
  // Si no hay nombre/apellido, intenta separar el campo name
  let nombre = user.nombre;
  let apellido = user.apellido;
  if ((!nombre || !apellido) && user.name) {
    const partes = user.name.split(" ");
    nombre = partes[0];
    apellido = partes.slice(1).join(" ");
  }

  // Si no hay campo activo, asumimos que está activo (por compatibilidad)
  const activo = user.activo !== undefined ? user.activo : true;

  return (
    <tr>
      <td>{user.id}</td>
      <td>{nombre}</td>
      <td>{apellido}</td>
      <td>{user.email}</td>
      <td>{user.role === "admin" ? "Administrador" : "Cliente"}</td>
      <td>
        <span style={{ color: activo ? "green" : "red" }}>
          {activo ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td>
        <button
          onClick={() => onToggleActive(user.id)}
          disabled={user.id === currentUserId}
        >
          {activo ? "Desactivar" : "Activar"}
        </button>
      </td>
      <td>
        <Link to={`/admin/users/${user.id}`}>Ver detalles</Link>
      </td>
      <td>
        <button
          onClick={() => onDeleteUser(user.id)}
          disabled={user.id === currentUserId}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default UserRow;