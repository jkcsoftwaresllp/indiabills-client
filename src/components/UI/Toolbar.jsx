// Replacement for @mui/material Toolbar
export const Toolbar = ({
  children,
  className = '',
  sx = {},
  ...props
}) => (
  <div
    className={`flex items-center px-6 py-4 gap-4 ${className}`}
    style={sx}
    {...props}
  >
    {children}
  </div>
);

export default Toolbar;
