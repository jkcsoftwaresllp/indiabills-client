// Replacement for @mui/material Switch
export const Switch = ({
  checked,
  onChange,
  disabled = false,
  className = '',
  color = 'primary',
  ...props
}) => {
  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-purple-600',
    error: 'bg-red-600',
    success: 'bg-green-600',
  };

  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <span
        className={`w-10 h-6 rounded-full transition-colors duration-200 ${
          checked ? colorClasses[color] : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
    </label>
  );
};

export default Switch;
