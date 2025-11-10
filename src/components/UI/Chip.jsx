// Replacement for @mui/material Chip
export const Chip = ({
  label,
  onDelete,
  color = 'default',
  variant = 'filled',
  className = '',
  sx = {},
  ...props
}) => {
  const colorClasses = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
  };
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colorClasses[color]} ${className}`}
      style={sx}
      {...props}
    >
      {label}
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-2 text-current opacity-70 hover:opacity-100"
          aria-label="Delete chip"
        >
          ✕
        </button>
      )}
    </div>
  );
};
export default Chip;