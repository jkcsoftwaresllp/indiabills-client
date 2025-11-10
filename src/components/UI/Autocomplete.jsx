// Replacement for @mui/material Autocomplete
import { useState, useRef } from 'react';
export const Autocomplete = ({
  options = [],
  value,
  onChange,
  getOptionLabel = (option) => option.label || option,
  renderInput,
  disabled = false,
  className = '',
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef(null);
  const filtered = options.filter((opt) =>
    getOptionLabel(opt).toLowerCase().includes(inputValue.toLowerCase())
  );
  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      {...props}
    >
      {renderInput?.({
        value: inputValue,
        onChange: (e) => {
          setInputValue(e.target.value);
          setOpen(true);
        },
        onFocus: () => setOpen(true),
        onBlur: () => setTimeout(() => setOpen(false), 200),
        disabled,
      })}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-50">
          {filtered.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                onChange?.(option);
                setInputValue('');
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {getOptionLabel(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Autocomplete;