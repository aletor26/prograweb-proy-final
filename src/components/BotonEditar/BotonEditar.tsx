import React from 'react';

interface BotonEditarProps {
  onClick: () => void;
  label?: string;
}

const BotonEditar: React.FC<BotonEditarProps> = ({ onClick, label = "Editar" }) => (
  <button className="edit-button" onClick={onClick}>
    <i className="fas fa-edit"></i> {label}
  </button>
);

export default BotonEditar;