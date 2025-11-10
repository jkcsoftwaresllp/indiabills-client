// Replacement for @mui/material InputAdornment
export const InputAdornment = ({
  position = 'end',
  children,
  className = '',
  ...props
}) => (
  <span
    className={`text-gray-500 ${className}`}
    {...props}
  >
    {children}
  </span>
);
export default InputAdornment;