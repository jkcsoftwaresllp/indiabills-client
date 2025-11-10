// Replacement for @mui/material Alert
export const Alert = ({
  children,
  severity = 'info',
  onClose,
  className = '',
  sx = {},
  ...props
}) => {
  const severityClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div
      className={`border-l-4 p-4 rounded ${severityClasses[severity]} ${className}`}
      style={sx}
      role="alert"
      {...props}
    >
      <div className="flex justify-between items-start">
        <div>{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current opacity-70 hover:opacity-100"
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
