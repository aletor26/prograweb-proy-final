import React from 'react';
import './SummaryCards.css';

interface SummaryCardsProps {
  totalOrders: number;
  newUsers: number;
  totalIncome: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalOrders,
  newUsers,
  totalIncome,
}) => (
  <div className="summary-cards" style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
    <div className="summary-card">
      <h2>Órdenes</h2>
      <p>{totalOrders}</p>
    </div>
    <div className="summary-card">
      <h2>Usuarios Nuevos</h2>
      <p>{newUsers}</p>
    </div>
    <div className="summary-card">
      <h2>Ingresos Totales</h2>
      <p>S/ {totalIncome.toFixed(2)}</p>
    </div>
  </div>
);

export default SummaryCards;