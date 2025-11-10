// Replacement for @mui/material FormGroup
export const FormGroup = ({
  children,
  row = false,
  className = '',
  sx = {},
  ...props
}) => (
  <div
    className={`flex ${row ? 'flex-row gap-4' : 'flex-col gap-2'} ${className}`}
    style={sx}
    {...props}
  >
    {children}
  </div>
);

export default FormGroup;
