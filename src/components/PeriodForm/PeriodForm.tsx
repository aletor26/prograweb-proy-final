import React from 'react';
import './PeriodForm.css';

interface PeriodFormProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const PeriodForm: React.FC<PeriodFormProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => (
  <form className="period-form" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <label>
      Desde:
      <input
        type="date"
        value={startDate}
        onChange={e => onStartDateChange(e.target.value)}
        max={endDate}
      />
    </label>
    <label>
      Hasta:
      <input
        type="date"
        value={endDate}
        onChange={e => onEndDateChange(e.target.value)}
        min={startDate}
      />
    </label>
  </form>
);

export default PeriodForm;