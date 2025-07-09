import React from 'react';
import './SummaryCards.css';

interface SummaryCardsProps {
  totalOrders: number;
  newUsers: number;
  totalIncome: number;
  isLoading?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalOrders,
  newUsers,
  totalIncome,
  isLoading = false,
}) => (
  <div className="summary-cards" style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
    <div className="summary-card">
      <h2>Órdenes</h2>
      <p>{isLoading ? 'Cargando...' : totalOrders}</p>
    </div>
    <div className="summary-card">
      <h2>Usuarios Nuevos</h2>
      <p>{isLoading ? 'Cargando...' : newUsers}</p>
    </div>
    <div className="summary-card">
      <h2>Ingresos Totales</h2>
      <p>{isLoading ? 'Cargando...' : `S/ ${totalIncome.toFixed(2)}`}</p>
    </div>
  </div>
);

export default SummaryCards;