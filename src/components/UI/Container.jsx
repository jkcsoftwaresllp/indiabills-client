// Replacement for @mui/material Container
export const Container = ({
  children,
  maxWidth = 'lg',
  className = '',
  sx = {},
  ...props
}) => {
  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div
      className={`mx-auto px-4 ${maxWidthClasses[maxWidth]} ${className}`}
      style={sx}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
