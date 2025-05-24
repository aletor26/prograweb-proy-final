import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './UserList.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastName?: string;
}

export default function UserList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    setUsers(storedUsers ? JSON.parse(storedUsers) : []);
  }, []);

  const handleDeactivate = (id: string) => {
    const updated = users.map(u =>
      u.id === id ? { ...u, active: !u.active } : u
    );
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

const filtered = users.filter(u =>
  (u.id && u.id.toString().includes(filter)) ||
  (u.name && u.name.toLowerCase().includes(filter.toLowerCase())) ||
  (u.lastName && u.lastName.toLowerCase().includes(filter.toLowerCase()))
);

  if (user?.role !== 'admin') {
    return <div>No autorizado</div>;
  }

  return (
    <div className="user-list-container">
      <h1>Lista de Usuarios</h1>
      <input
        type="text"
        placeholder="Filtrar por ID, nombre o apellido"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="user-filter-input"
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name} {u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.active ? (
                  <span className="active-status">Activo</span>
                ) : (
                  <span className="inactive-status">Inactivo</span>
                )}
              </td>
              <td>
                <button
                  className={u.active ? 'deactivate-btn' : 'activate-btn'}
                  onClick={() => handleDeactivate(u.id)}
                >
                  {u.active ? 'Desactivar' : 'Activar'}
                </button>
                <button onClick={() => navigate(`/admin/users/${u.id}`)}>
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}