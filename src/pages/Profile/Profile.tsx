import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Mi Perfil</h1>
        
        <div className="profile-info">
          <div className="info-group">
            <label>Nombre</label>
            <p>{user?.name}</p>
          </div>
          
          <div className="info-group">
            <label>Correo</label>
            <p>{user?.email}</p>
          </div>
        </div>

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