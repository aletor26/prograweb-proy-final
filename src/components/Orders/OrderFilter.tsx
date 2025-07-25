import React from "react";

interface OrderFilterProps {
  searchTerm: string;
  searchField: 'id' | 'nombre' | 'apellido';
  onSearchTermChange: (term: string) => void;
  onSearchFieldChange: (field: 'id' | 'nombre' | 'apellido') => void;
  onSearch?: () => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ searchTerm, searchField, onSearchTermChange, onSearchFieldChange, onSearch }) => {
  return (
    <div className="admin-search-bar">
      <select
        className="admin-search-select"
        value={searchField}
        onChange={e => onSearchFieldChange(e.target.value as 'id' | 'nombre' | 'apellido')}
      >
        <option value="id">ID</option>
        <option value="nombre">Nombre</option>
        <option value="apellido">Apellido</option>
      </select>
      <input
        className="admin-search-input"
        type="text"
        placeholder={`Buscar por ${searchField}`}
        value={searchTerm}
        onChange={e => onSearchTermChange(e.target.value)}
      />
      {onSearch && (
        <button className="admin-search-button" onClick={onSearch}>
          Buscar
        </button>
      )}
    </div>
  );
};

export default OrderFilter;
