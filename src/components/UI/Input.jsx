// Replacement for @mui/material Input
export const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  className = '',
  fullWidth = false,
  ...props
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className={`px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      fullWidth ? 'w-full' : ''
    } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''} ${className}`}
    {...props}
  />
);

export default Input;
