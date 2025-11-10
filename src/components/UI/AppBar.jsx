// Replacement for @mui/material AppBar
export const AppBar = ({
  children,
  position = 'static',
  className = '',
  sx = {},
  ...props
}) => {
  const positionClasses = {
    static: 'relative',
    absolute: 'absolute',
    fixed: 'fixed',
    sticky: 'sticky',
  };

  return (
    <header
      className={`bg-white shadow-md ${positionClasses[position]} w-full z-40 ${className}`}
      style={sx}
      {...props}
    >
      {children}
    </header>
  );
};

export default AppBar;
