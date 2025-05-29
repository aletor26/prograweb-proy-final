import React, { useState, useEffect } from "react";
import UserFilter from "./UserFilter";
import UserRow from "./UserRow";

// Simulación de usuarios (luego se puede traer de API)
const usuariosMock = [
  { id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@mail.com", activo: true },
  { id: "2", nombre: "Ana", apellido: "García", email: "ana@mail.com", activo: false },
  // ...más usuarios
];

const UserList: React.FC = () => {
  const [filters, setFilters] = useState({ id: "", nombre: "", apellido: "" });
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    setUsuarios(storedUsers ? JSON.parse(storedUsers) : []);
    const currentUser = localStorage.getItem('currentUser');
    setCurrentUserId(currentUser ? JSON.parse(currentUser).id : undefined);
  }, []);

  // Filtrado simple
  const usuariosFiltrados = usuarios.filter(u =>
    u.id.includes(filters.id) &&
    (u.nombre?.toLowerCase() ?? u.name?.toLowerCase() ?? "").includes(filters.nombre.toLowerCase()) &&
    (u.apellido?.toLowerCase() ?? "").includes(filters.apellido.toLowerCase())
  );

  // Activar/desactivar usuario
  const handleToggleActive = (id: string) => {
    const updated = usuarios.map(u =>
      u.id === id ? { ...u, activo: !u.activo } : u
    );
    setUsuarios(updated);
    localStorage.setItem('users', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUserId) {
      alert('No puedes eliminar tu propio usuario administrador');
      return;
    }
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const updated = usuarios.filter(u => u.id !== id);
      setUsuarios(updated);
      localStorage.setItem('users', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <UserFilter filters={filters} onChange={setFilters} />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acción</th>
            <th>Detalles</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map(user => (
            <UserRow
              key={user.id}
              user={user}
              onToggleActive={handleToggleActive}
              onDeleteUser={handleDeleteUser}
              currentUserId={currentUserId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
