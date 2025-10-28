import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const EditableDropdown = ({ 
  name, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select or type...",
  className = "",
  error = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (inputValue) {
      const filtered = options.filter(option => 
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [inputValue, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange({ target: { name, value: newValue } });
    setIsOpen(true);
  };

  const handleOptionSelect = (option) => {
    setInputValue(option);
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-4 pr-10 bg-white transition-all ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
        >
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''} ${disabled ? 'opacity-50' : ''}`} />
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full z-[9999] w-full mt-1 bg-white border-2 border-blue-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <div className="py-1">
              {filteredOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm text-gray-900 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-4 text-center">
              <Search className="w-6 h-6 text-gray-300 mx-auto mb-1" />
              <p className="text-xs text-gray-500">No options found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableDropdown;
