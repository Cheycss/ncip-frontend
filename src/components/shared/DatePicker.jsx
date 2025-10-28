import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ 
  name, 
  value, 
  onChange, 
  placeholder = "MM/DD/YYYY",
  className = "",
  error = false,
  label = "",
  required = false,
  minDate = "",
  maxDate = ""
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Convert YYYY-MM-DD to MM/DD/YYYY for display
  const formatDisplayDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${month}/${day}/${year}`;
  };
  
  // Convert MM/DD/YYYY to YYYY-MM-DD for storage
  const formatISODate = (displayDate) => {
    if (!displayDate) return '';
    const parts = displayDate.replace(/\D/g, ''); // Remove non-digits
    if (parts.length >= 8) {
      const month = parts.substring(0, 2);
      const day = parts.substring(2, 4);
      const year = parts.substring(4, 8);
      return `${year}-${month}-${day}`;
    }
    return '';
  };
  
  const handleTextChange = (e) => {
    let input = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Auto-format as user types: MM/DD/YYYY
    if (input.length >= 2) {
      input = input.substring(0, 2) + '/' + input.substring(2);
    }
    if (input.length >= 5) {
      input = input.substring(0, 5) + '/' + input.substring(5, 9);
    }
    
    // Limit to 10 characters (MM/DD/YYYY)
    input = input.substring(0, 10);
    
    // Update display value
    e.target.value = input;
    
    // If complete date, convert to ISO and trigger onChange
    if (input.length === 10) {
      const isoDate = formatISODate(input);
      onChange({ target: { name, value: isoDate } });
    } else {
      onChange({ target: { name, value: '' } });
    }
  };
  
  const handleCalendarChange = (e) => {
    onChange(e);
    setShowCalendar(false);
  };
  
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
          <Calendar className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
        </div>
        
        {/* Text input for typing MM/DD/YYYY */}
        <input
          type="text"
          name={`${name}_display`}
          defaultValue={formatDisplayDate(value)}
          onChange={handleTextChange}
          placeholder={placeholder}
          maxLength={10}
          className={`w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 pl-12 pr-16 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-white focus:from-white focus:to-white transition-all cursor-text font-medium shadow-sm hover:shadow-md ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
          } ${className}`}
        />
        
        {/* Calendar icon button */}
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <Calendar className="w-5 h-5" />
        </button>
        
        {/* Hidden date input for calendar picker */}
        {showCalendar && (
          <input
            type="date"
            name={name}
            value={value}
            onChange={handleCalendarChange}
            min={minDate}
            max={maxDate}
            onBlur={() => setTimeout(() => setShowCalendar(false), 200)}
            autoFocus
            className="absolute top-full left-0 mt-1 border-2 border-blue-500 rounded-lg p-2 shadow-lg z-50 bg-white"
          />
        )}
      </div>
    </div>
  );
};

export default DatePicker;
