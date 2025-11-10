// Replacement for @mui/material IconButton
export const IconButton = ({
  children,
  onClick,
  disabled = false,
  size = 'medium',
  color = 'primary',
  className = '',
  sx = {},
  ...props
}) => {
  const sizeClasses = {
    small: 'p-1 text-sm',
    medium: 'p-2 text-base',
    large: 'p-3 text-lg',
  };

  const colorClasses = {
    primary: 'text-blue-600 hover:bg-blue-50',
    secondary: 'text-gray-600 hover:bg-gray-50',
    error: 'text-red-600 hover:bg-red-50',
    success: 'text-green-600 hover:bg-green-50',
    inherit: 'text-inherit hover:bg-gray-100',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded transition-colors duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      style={sx}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
