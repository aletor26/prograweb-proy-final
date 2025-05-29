import React from 'react';

interface BotonCerrarSesionProps {
  onClick: () => void;
  className?: string;
}

const BotonCerrarSesion: React.FC<BotonCerrarSesionProps> = ({ onClick, className }) => (
  <button onClick={onClick} className={className}>
    <i className="fas fa-right-from-bracket" style={{ marginRight: 8 }}></i>
    Cerrar sesión
  </button>
);

export default BotonCerrarSesion;