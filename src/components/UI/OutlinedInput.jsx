// Replacement for @mui/material OutlinedInput
export const OutlinedInput = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  className = '',
  fullWidth = false,
  endAdornment,
  startAdornment,
  ...props
}) => (
  <div className={`relative flex items-center ${fullWidth ? 'w-full' : ''}`}>
    {startAdornment && (
      <span className="absolute left-3 text-gray-500">{startAdornment}</span>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        fullWidth ? 'w-full' : ''
      } ${startAdornment ? 'pl-10' : ''} ${endAdornment ? 'pr-10' : ''} ${
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
      } ${className}`}
      {...props}
    />
    {endAdornment && (
      <span className="absolute right-3 text-gray-500">{endAdornment}</span>
    )}
  </div>
);

export default OutlinedInput;
