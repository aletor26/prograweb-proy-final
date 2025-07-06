import React, { useState, useEffect } from "react";
import UserFilter from "./UserFilter";
import UserRow from "./UserRow";
import { getUsuariosAdmin, activarUsuario, desactivarUsuario } from "../../services/usuarioservicio";
import './UserList.css';

const UserList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'id' | 'nombre' | 'apellido'>('id');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios del backend
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Construir parámetros de filtro
      const params: any = {};
      if (searchTerm) {
        if (searchField === 'id') {
          params.id = searchTerm;
        } else if (searchField === 'nombre') {
          params.nombre = searchTerm;
        } else if (searchField === 'apellido') {
          params.apellido = searchTerm;
        }
      }
      
      const response = await getUsuariosAdmin(params);
      setUsuarios(response.rows || response || []);
    } catch (err: any) {
      console.error('Error al cargar usuarios:', err);
      setError(err.message || 'Error al cargar usuarios');
      // Fallback a localStorage si hay error
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsuarios(JSON.parse(storedUsers));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Cargar usuario actual
    const currentUser = localStorage.getItem('currentUser');
    setCurrentUserId(currentUser ? JSON.parse(currentUser).id : undefined);
    
    // Cargar usuarios
    loadUsers();
  }, []);

  // Recargar usuarios cuando cambien los filtros
  useEffect(() => {
    if (!isLoading) {
      loadUsers();
    }
  }, [searchTerm, searchField]);

  // Activar/desactivar usuario usando el servicio
  const handleToggleActive = async (id: string) => {
    try {
      const user = usuarios.find(u => u.id === id);
      if (!user) return;

      if (user.activo) {
        await desactivarUsuario(Number(id));
      } else {
        await activarUsuario(Number(id));
      }

      // Recargar usuarios después del cambio
      await loadUsers();
    } catch (err: any) {
      console.error('Error al cambiar estado del usuario:', err);
      alert(err.message || 'Error al cambiar estado del usuario');
    }
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUserId) {
      alert('No puedes eliminar tu propio usuario administrador');
      return;
    }
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      // Por ahora mantenemos la lógica de localStorage para eliminar
      // ya que no hay endpoint de eliminar en el backend
      const updated = usuarios.filter(u => u.id !== id);
      setUsuarios(updated);
      localStorage.setItem('users', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  if (isLoading) {
    return (
      <div className="user-list-container">
        <div className="loading">Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container">
        <div className="error">Error: {error}</div>
        <button onClick={loadUsers}>Reintentar</button>
      </div>
    );
  }

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
          {usuarios.map(user => (
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
