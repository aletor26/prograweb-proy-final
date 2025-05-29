import UserForm from '../User/UserForm';
import { useAuth } from '../../context/AuthContext';
import BotonEditar from '../../components/BotonEditar/BotonEditar';
import BotonCerrarSesion from '../../components/BotonCerrarSesion/BotonCerrarSesion';
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
          <div>
            <div style={{ marginBottom: '12px' }}>
              <BotonEditar onClick={handleEditProfile} label="Editar perfil" />
            </div>
            <BotonCerrarSesion
              onClick={logout}
              className="logout-button"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;