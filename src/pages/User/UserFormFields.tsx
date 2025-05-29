import React from 'react';

interface UserFormFieldsProps {
  formData: {
    name: string;
    email: string;
    password?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ formData, onChange }) => (
  <>
    <div className="form-group">
      <label htmlFor="name">Nombre</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={onChange}
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
        onChange={onChange}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="password">Nueva Contraseña (dejar en blanco para mantener la actual)</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password || ''}
        onChange={onChange}
        placeholder="••••••"
      />
    </div>
  </>
);

export default UserFormFields;