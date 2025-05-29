import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserDataView from './UserDataView';
import UserFormFields from './UserFormFields';
import './UserForm.css';

interface UserFormData {
  id: string;
  name: string;
  email: string;
  password?: string;
}

interface UserFormProps {
  editMode: boolean;
  setEditMode: (value: boolean) => void;
}

const UserForm: React.FC<UserFormProps> = ({ editMode, setEditMode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<UserFormData>({
    id: '',
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user?.role !== 'customer') {
      navigate('/');
      return;
    }
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: ''
    });
  }, [user, navigate]);

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

      const updatedUsers = users.map((u: any) => {
        if (u.id === formData.id || u.dni === formData.id) {
          const updates = {
            ...u,
            name: formData.name,
            email: formData.email,
            updatedAt: new Date().toISOString()
          };

          if (formData.password && formData.password.trim() !== '') {
            updates.password = formData.password;
          }

          return updates;
        }
        return u;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setShowMessage(true);
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        setShowMessage(false);
        setEditMode(false);
      }, 1500);
    } catch (error) {
      setError('Error al guardar los cambios');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  if (user?.role !== 'customer') {
    return null;
  }

  // Vista SOLO LECTURA
  if (!editMode) {
    return (
      <div className="user-form-container">
        <h1>Mi Perfil</h1>
        <UserDataView name={formData.name} email={formData.email} />
        {/* El botón de editar perfil se muestra fuera de este componente, en Profile */}
      </div>
    );
  }

  // Vista EDITABLE
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
      <h1>Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="user-form">
        <UserFormFields formData={formData} onChange={handleChange} />
        <div className="form-actions">
          <button
            type="button"
            onClick={() => setEditMode(false)}
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