import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
      <ReactDatePicker
        selected={new Date(startDate)}
        onChange={date => onStartDateChange(date?.toISOString().slice(0, 10) || '')}
        selectsStart
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        dateFormat="yyyy-MM-dd"
        maxDate={new Date(endDate)}
        className="period-datepicker"
      />
    </label>
    <label>
      Hasta:
      <ReactDatePicker
        selected={new Date(endDate)}
        onChange={date => onEndDateChange(date?.toISOString().slice(0, 10) || '')}
        selectsEnd
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        dateFormat="yyyy-MM-dd"
        minDate={new Date(startDate)}
        className="period-datepicker"
      />
    </label>
  </form>
);

export default PeriodForm;