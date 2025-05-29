import UserForm from '../User/UserForm';
import { useAuth } from '../../context/AuthContext';
import BotonEditar from '../../components/BotonEditar/BotonEditar';
import { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const { logout } = useAuth();
  const [editMode, setEditMode] = useState(false);

  const handleEditProfile = () => {
    setEditMode(true);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <UserForm editMode={editMode} setEditMode={setEditMode} />
        {!editMode && (
          <div style={{ margin: '16px 0' }}>
            <BotonEditar onClick={handleEditProfile} label="Editar perfil" />
          </div>
        )}
        <button
          onClick={logout}
          className="logout-button"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Profile;