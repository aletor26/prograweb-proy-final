import UserForm from '../Admin/Users/UserForm';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { logout } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-card">
        <UserForm />
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