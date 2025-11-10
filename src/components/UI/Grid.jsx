// Replacement for @mui/material Grid
export const Grid = ({
  children,
  container = false,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing = 2,
  className = '',
  sx = {},
  ...props
}) => {
  const colClasses = {
    1: 'w-1/12',
    2: 'w-2/12',
    3: 'w-3/12 md:w-1/4',
    4: 'w-4/12 md:w-1/3',
    6: 'w-6/12 md:w-1/2',
    12: 'w-full',
  };
  const spacingClasses = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };
  const baseClass = container ? `flex flex-wrap ${spacingClasses[spacing]}` : '';
  const colClass = item && xs ? colClasses[xs] : '';
  return (
    <div className={`${baseClass} ${colClass} ${className}`} style={sx} {...props}>
      {children}
    </div>
  );
};
export default Grid;