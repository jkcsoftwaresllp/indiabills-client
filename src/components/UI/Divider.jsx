// Replacement for @mui/material Divider
export const Divider = ({
  className = '',
  sx = {},
  orientation = 'horizontal',
  ...props
}) => {
  const isVertical = orientation === 'vertical';

  return (
    <div
      className={`${
        isVertical
          ? 'w-px h-full bg-gray-300'
          : 'h-px w-full bg-gray-300'
      } ${className}`}
      style={sx}
      {...props}
    />
  );
};

export default Divider;
