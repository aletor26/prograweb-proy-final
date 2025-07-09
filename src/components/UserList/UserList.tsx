import React, { useState, useEffect, useMemo } from "react";
import UserFilter from "./UserFilter";
import UserRow from "./UserRow";
import { getUsuariosAdmin, activarUsuario, desactivarUsuario } from "../../services/usuarioservicio";
import './UserList.css';
import Paginacion from "../Paginacion/Paginacion";

const UserList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'id' | 'nombre' | 'apellido'>('id');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]); // Todos los usuarios sin filtrar
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // 10 usuarios por página en el frontend
  const [backendLimit] = useState(1000); // Cargar muchos usuarios del backend

  // Cargar usuarios del backend
  const loadUsers = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Solo traer datos del backend, sin filtros
      const params: any = {};
      params.page = 1; // Siempre cargar desde la página 1
      params.limit = backendLimit; // Cargar muchos usuarios
      
      const response = await getUsuariosAdmin(params);
      
      // El backend devuelve { count: number, rows: User[] }
      // donde cada User tiene { Estado: { id: number, nombre: string } }
      const users = response.rows || response || [];
      // No usar count del backend, calcular basado en usuarios filtrados
      
      // Transformar los datos para que sean compatibles con el componente
      const transformedUsers = users.map((user: any) => {
        console.log('Usuario del backend:', user); // Debug para ver qué campos tiene
        
        // Función para determinar el rol basado en diferentes campos posibles
        const getRole = (user: any) => {
          // Intentar diferentes campos posibles
          const roleValue = user.rol || user.role || user.tipo || user.roleId || user.rolId;
          
          // Si no hay campo de rol, verificar si es admin por otros medios
          if (!roleValue) {
            // Verificar si tiene permisos de admin o si el email contiene 'admin'
            if (user.correo?.toLowerCase().includes('admin') || 
                user.nombre?.toLowerCase().includes('admin') ||
                user.isAdmin === true ||
                user.admin === true) {
              return 'admin';
            }
            return 'customer';
          }
          
          // Normalizar el valor del rol
          const roleStr = roleValue.toString().toLowerCase();
          if (roleStr.includes('admin') || roleStr === '1' || roleStr === 'administrador') {
            return 'admin';
          } else if (roleStr.includes('customer') || roleStr.includes('cliente') || roleStr === '2' || roleStr === 'usuario') {
            return 'customer';
          }
          
          return 'customer'; // Por defecto
        };
        
        return {
          ...user,
          // Mapear campos del backend a los que espera el componente
          email: user.correo,
          name: user.nombre,
          activo: user.Estado?.nombre === 'Activo' || user.estadoid === 1,
          role: getRole(user),
          createdAt: user.createdAt
        };
      });
      
      setAllUsers(transformedUsers);
    } catch (err: any) {
      console.error('Error al cargar usuarios:', err);
      setError(err.message || 'Error al cargar usuarios');
      // Fallback a localStorage si hay error
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setAllUsers(JSON.parse(storedUsers));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar usuarios usando useMemo para evitar recálculos innecesarios
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return allUsers;
    
    return allUsers.filter((user: any) => {
      const userId = user.id?.toString() || '';
      const userName = user.name || user.nombre || '';
      const userApellido = user.apellido || '';
      const searchLower = searchTerm.toLowerCase();
      
      if (searchField === 'id') {
        return userId.includes(searchLower);
      } else if (searchField === 'nombre') {
        return userName.toLowerCase().includes(searchLower);
      } else if (searchField === 'apellido') {
        return userApellido.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }, [allUsers, searchTerm, searchField]);

  // Calcular usuarios paginados
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, limit]);

  // Actualizar usuarios cuando cambien los filtros
  useEffect(() => {
    setUsuarios(paginatedUsers);
    // Recalcular paginación basada en usuarios filtrados
    const newTotalPages = Math.max(1, Math.ceil(filteredUsers.length / limit));
    setTotalPages(newTotalPages);
    
    // Si la página actual es mayor que el nuevo total, resetear a página 1
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [paginatedUsers, filteredUsers, currentPage, limit]);

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
    // No recargar, el filtrado ya es automático
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
