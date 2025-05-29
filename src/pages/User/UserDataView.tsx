import React from 'react';

interface UserDataViewProps {
  name: string;
  email: string;
}

const UserDataView: React.FC<UserDataViewProps> = ({ name, email }) => (
  <div className="user-data-view">
    <div className="form-group">
      <label>Nombre</label>
      <div className="data-value">{name}</div>
    </div>
    <div className="form-group">
      <label>Email</label>
      <div className="data-value">{email}</div>
    </div>
    <div className="form-group">
      <label>Contraseña</label>
      <div className="data-value">••••••</div>
    </div>
  </div>
);

export default UserDataView;