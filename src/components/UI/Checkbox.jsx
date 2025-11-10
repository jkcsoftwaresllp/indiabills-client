// Replacement for @mui/material Checkbox
export const Checkbox = ({
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    disabled={disabled}
    className={`w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
    {...props}
  />
);

export default Checkbox;
