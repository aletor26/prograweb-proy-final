import React, { useState, useEffect } from "react";
import UserFilter from "./UserFilter";
import UserRow from "./UserRow";
import { getUsuariosAdmin, activarUsuario, desactivarUsuario } from "../../services/usuarioservicio";
import './UserList.css';
import Paginacion from "../Paginacion/Paginacion";

const UserList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'id' | 'nombre' | 'apellido'>('id');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // 10 usuarios por página

  // Cargar usuarios del backend
  const loadUsers = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Construir parámetros de filtro según el endpoint del backend
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
      
      // Agregar paginación
      params.page = page;
      params.limit = limit;
      
      const response = await getUsuariosAdmin(params);
      
      // El backend devuelve { count: number, rows: User[] }
      // donde cada User tiene { Estado: { id: number, nombre: string } }
      const users = response.rows || response || [];
      const count = response.count || users.length;
      setTotalPages(Math.max(1, Math.ceil(count / limit)));
      // Transformar los datos para que sean compatibles con el componente
      const transformedUsers = users.map((user: any) => ({
        ...user,
        // Mapear campos del backend a los que espera el componente
        email: user.correo,
        name: user.nombre,
        activo: user.Estado?.nombre === 'Activo' || user.estadoid === 1,
        role: user.role || 'customer', // Por defecto customer si no existe
        createdAt: user.createdAt
      }));
      
      setUsuarios(transformedUsers);
    } catch (err: any) {
      console.error('Error al cargar usuarios:', err);
      setError(err.message || 'Error al cargar usuarios');
      // Fallback a localStorage si hay error
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsuarios(JSON.parse(storedUsers));
        setTotalPages(1);
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
    loadUsers(1);
    setCurrentPage(1);
  }, []);

  // Recargar usuarios cuando cambien los filtros
  useEffect(() => {
    if (!isLoading) {
      loadUsers(1);
      setCurrentPage(1);
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
      await loadUsers(currentPage);
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

  // Función separada para cambio de página
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    loadUsers(page);
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
        <button onClick={() => loadUsers(currentPage)}>Reintentar</button>
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
      <Paginacion
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UserList;
