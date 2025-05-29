import React from 'react';

interface AgregarProps {
  onClick: () => void;
  label?: string;
}

const Agregar: React.FC<AgregarProps> = ({ onClick, label = "Agregar" }) => (
  <button className="add-button" onClick={onClick}>
    <i className="fas fa-plus"></i> {label}
  </button>
);

export default Agregar;