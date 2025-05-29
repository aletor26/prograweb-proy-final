import React from 'react';
import './Paginacion.css';

interface PaginacionProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginacion: React.FC<PaginacionProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span className="pagination-info">
        Página {currentPage} de {totalPages}
      </span>
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Paginacion;