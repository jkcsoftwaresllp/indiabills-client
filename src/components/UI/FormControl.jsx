// Replacement for @mui/material FormControl components
export const FormControl = ({
  children,
  fullWidth = false,
  disabled = false,
  error = false,
  className = '',
  sx = {},
  ...props
}) => (
  <fieldset
    className={`${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    disabled={disabled}
    style={sx}
    {...props}
  >
    {children}
  </fieldset>
);
export const FormLabel = ({
  children,
  className = '',
  sx = {},
  ...props
}) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} style={sx} {...props}>
    {children}
  </label>
);
export const InputLabel = ({
  children,
  className = '',
  sx = {},
  ...props
}) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} style={sx} {...props}>
    {children}
  </label>
);
export default FormControl;