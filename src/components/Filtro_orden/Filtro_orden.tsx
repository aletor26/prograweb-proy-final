import React, { useState, useRef, useEffect } from 'react';

type SortType = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

interface FiltroOrdenProps {
  sort: SortType;
  setSort: (sort: SortType) => void;
}

const options = [
  { value: 'name-asc', label: 'Nombre (A-Z)' },
  { value: 'name-desc', label: 'Nombre (Z-A)' },
  { value: 'price-asc', label: 'Precio (menor a mayor)' },
  { value: 'price-desc', label: 'Precio (mayor a menor)' },
];

const Filtro_orden: React.FC<FiltroOrdenProps> = ({ sort, setSort }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: 20, display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
        aria-label="Mostrar opciones de ordenamiento"
      >
        {/* Icono de filtro */}
        <svg width="24" height="24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="20" y2="21"/>
          <line x1="4" y1="10" x2="20" y2="10"/>
          <line x1="12" y1="3" x2="12" y2="21"/>
        </svg>
        <span style={{ fontWeight: 600, color: '#4338ca' }}>Ordenar</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 0,
            background: '#fff',
            border: '2px solid #6366f1',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(99,102,241,0.13)',
            zIndex: 10,
            minWidth: 210,
            padding: '8px 0'
          }}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                setSort(opt.value as SortType);
                setOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 18px',
                background: sort === opt.value ? '#e0e7ff' : 'none',
                color: '#373737',
                border: 'none',
                textAlign: 'left',
                fontWeight: sort === opt.value ? 700 : 400,
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filtro_orden;