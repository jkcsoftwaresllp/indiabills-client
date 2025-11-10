// Replacement for @mui/material Paper
export const Paper = ({
  children,
  elevation = 1,
  className = '',
  sx = {},
  ...props
}) => {
  const elevationClasses = {
    0: 'shadow-none',
    1: 'shadow-sm',
    2: 'shadow',
    3: 'shadow-md',
    4: 'shadow-lg',
    6: 'shadow-xl',
  };

  const shadowClass = elevationClasses[elevation] || elevationClasses[1];

  return (
    <div
      className={`${shadowClass} rounded-lg bg-white ${className}`}
      style={sx}
      {...props}
    >
      {children}
    </div>
  );
};

export default Paper;
