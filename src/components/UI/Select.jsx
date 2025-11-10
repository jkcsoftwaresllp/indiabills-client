// Replacement for @mui/material Select
export const Select = ({
  value,
  onChange,
  children,
  className = '',
  fullWidth = false,
  disabled = false,
  sx = {},
  ...props
}) => (
  <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className={`px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      fullWidth ? 'w-full' : ''
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    style={sx}
    {...props}
  >
    {children}
  </select>
);

export default Select;
