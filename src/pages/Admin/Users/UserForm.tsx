import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './UserForm.css';

interface UserFormData {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

const UserForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<UserFormData>({
    id: '',
    name: '',
    email: '',
    role: 'customer'
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const userData = location.state?.user;
    console.log('Datos recibidos en UserForm:', {
      urlId: id,
      locationState: location.state,
      userData: userData
    });

    if (userData && userData.id) {
      console.log('Configurando datos del usuario desde state:', userData);
      setFormData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
    } else if (id) {
      console.log('Buscando usuario en localStorage con ID:', id);
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        try {
          const users = JSON.parse(storedUsers);
          console.log('Usuarios en localStorage:', users);
          const userToEdit = users.find((u: any) => u.id === id || u.dni === id);
          console.log('Usuario encontrado:', userToEdit);
          
          if (userToEdit) {
            setFormData({
              id: userToEdit.id || userToEdit.dni,
              name: userToEdit.name,
              email: userToEdit.email,
              role: userToEdit.role
            });
          } else {
            setError('Usuario no encontrado');
            setTimeout(() => navigate('/admin/users'), 2000);
          }
        } catch (error) {
          console.error('Error al cargar usuario:', error);
          setError('Error al cargar los datos del usuario');
          setTimeout(() => navigate('/admin/users'), 2000);
        }
      }
    } else {
      setError('No se recibieron datos del usuario');
      setTimeout(() => navigate('/admin/users'), 2000);
    }
  }, [user, navigate, id, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.id) {
      setError('Error: No se encontró el ID del usuario');
      return;
    }

    try {
      const storedUsers = localStorage.getItem('users');
      let users = storedUsers ? JSON.parse(storedUsers) : [];

      if (formData.role === 'customer') {
        const currentUser = users.find((u: any) => u.id === formData.id);
        if (currentUser?.role === 'admin') {
          const adminCount = users.filter((u: any) => u.role === 'admin').length;
          if (adminCount === 1) {
            setError('No puedes cambiar el rol del último administrador');
            return;
          }
        }
      }

      const updatedUsers = users.map((u: any) => {
        if (u.id === formData.id || u.dni === formData.id) {
          const updates = {
            ...u,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            updatedAt: new Date().toISOString()
          };

          if (formData.password && formData.password.trim() !== '') {
            updates.password = formData.password;
          }

          return updates;
        }
        return u;
      });

      console.log('Usuario actualizado:', updatedUsers.find((u: any) => u.id === formData.id));
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setShowMessage(true);
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setError('Error al guardar los cambios');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  return (
    <div className="user-form-container">
      {showMessage && (
        <div className="success-message">
          <p>¡Usuario guardado exitosamente!</p>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      <h1>Editar Usuario</h1>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Rol</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="role-select"
          >
            <option value="customer">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="password">Nueva Contraseña (dejar en blanco para mantener la actual)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password || ''}
            onChange={handleChange}
            placeholder="••••••"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/admin/users')} 
            className="cancel-button"
          >
            Cancelar
          </button>
          <button type="submit" className="save-button">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm; 