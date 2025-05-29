import React, { useState } from "react";

interface OrderFilterProps {
  filters: { id: string; nombre: string; apellido: string };
  onChange: (filters: { id: string; nombre: string; apellido: string }) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ filters, onChange }) => (
  <div style={{ display: "flex", gap: "1rem", marginBottom: 20 }}>
    <input
      type="text"
      placeholder="ID de Orden"
      value={filters.id}
      onChange={e => onChange({ ...filters, id: e.target.value })}
    />
    <input
      type="text"
      placeholder="Nombre"
      value={filters.nombre}
      onChange={e => onChange({ ...filters, nombre: e.target.value })}
    />
    <input
      type="text"
      placeholder="Apellido"
      value={filters.apellido}
      onChange={e => onChange({ ...filters, apellido: e.target.value })}
    />
  </div>
);

export default OrderFilter;
