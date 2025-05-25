import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminUsers.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  dni?: string;
  password?: string;
}

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem('users');
        console.log('Usuarios almacenados:', storedUsers);
        
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          console.log('Usuarios parseados:', parsedUsers);
          
          // Asegurarse de que cada usuario tenga un ID válido manteniendo todos los datos
          const usersWithValidData = parsedUsers.map((u: any) => ({
            ...u,  // Mantener todos los datos originales
            id: u.id || u.dni || Math.random().toString(36).substring(2, 11),
            createdAt: u.createdAt || new Date().toISOString()
          }));
          
          console.log('Usuarios con IDs válidos:', usersWithValidData);
          setUsers(usersWithValidData);
          
          // Actualizar localStorage solo si es necesario (si se generaron nuevos IDs)
          const needsUpdate = usersWithValidData.some((u: any, i: number) => u.id !== parsedUsers[i].id);
          if (needsUpdate) {
            localStorage.setItem('users', JSON.stringify(usersWithValidData));
          }
        }
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
      setIsLoading(false);
    };

    loadUsers();
    window.addEventListener('storage', loadUsers);
    return () => {
      window.removeEventListener('storage', loadUsers);
    };
  }, [user, navigate]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === user?.id) {
      alert('No puedes eliminar tu propio usuario administrador');
      return;
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const updatedUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const handleEditUser = (userItem: User) => {
    console.log('Intentando editar usuario con datos completos:', userItem);
    if (!userItem.id) {
      console.error('Usuario sin ID válido:', userItem);
      return;
    }

    navigate(`/admin/users/${userItem.id}/edit`, {
      state: { user: userItem }
    });
  };

  if (isLoading) {
    return (
      <div className="admin-users">
        <div className="loading">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>Gestión de Usuarios</h1>
      </div>

      <div className="users-section">
        <div className="users-list">
          {users.length === 0 ? (
            <div className="no-users">
              <p>No hay usuarios registrados</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha de Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem.id}>
                    <td>{userItem.name}</td>
                    <td>{userItem.email}</td>
                    <td>
                      <span className={`role-badge ${userItem.role}`}>
                        {userItem.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </span>
                    </td>
                    <td>{formatDate(userItem.createdAt)}</td>
                    <td className="actions-cell">
                      <button 
                        className="action-button edit-button"
                        onClick={() => handleEditUser(userItem)}
                        title="Editar usuario"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="action-button delete-button"
                        onClick={() => handleDeleteUser(userItem.id)}
                        title="Eliminar usuario"
                        disabled={userItem.id === user?.id}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers; 