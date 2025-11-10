// Replacement for @mui/material Snackbar
export const Snackbar = ({
  open,
  onClose,
  message,
  autoHideDuration = 6000,
  children,
  className = '',
  sx = {},
  ...props
}) => {
  if (!open) return null;

  // Auto-hide after duration
  if (autoHideDuration) {
    setTimeout(() => {
      onClose?.();
    }, autoHideDuration);
  }

  return (
    <div
      className={`fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-3 rounded shadow-lg z-50 max-w-sm ${className}`}
      style={sx}
      {...props}
    >
      <div className="flex justify-between items-center">
        <div>{children || message}</div>
        <button
          onClick={onClose}
          className="ml-4 text-white opacity-70 hover:opacity-100"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Snackbar;
