import React, { useState, useEffect } from "react";
import UserFilter from "./UserFilter";
import UserRow from "./UserRow";
import './UserList.css';

// Simulación de usuarios (luego se puede traer de API)
const usuariosMock = [
  { id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@mail.com", activo: true },
  { id: "2", nombre: "Ana", apellido: "García", email: "ana@mail.com", activo: false },
  // ...más usuarios
];

const UserList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'id' | 'nombre' | 'apellido'>('id');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    setUsuarios(storedUsers ? JSON.parse(storedUsers) : []);
    const currentUser = localStorage.getItem('currentUser');
    setCurrentUserId(currentUser ? JSON.parse(currentUser).id : undefined);
  }, []);

  // Filtrado según campo
  const usuariosFiltrados = usuarios.filter(u => {
    const value =
      searchField === 'id' ? u.id :
      searchField === 'nombre' ? (u.nombre?.toLowerCase() ?? u.name?.toLowerCase() ?? '') :
      searchField === 'apellido' ? (u.apellido?.toLowerCase() ?? '') : '';
    return value.includes(searchTerm.toLowerCase());
  });

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
    <div className="user-list-container">
      <h2>Lista de Usuarios</h2>
      <UserFilter
        searchTerm={searchTerm}
        searchField={searchField}
        onSearchTermChange={setSearchTerm}
        onSearchFieldChange={setSearchField}
      />
      <table className="user-table">
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
