// Replacement for @mui/material Dialog components
export const Dialog = ({ open, onClose, children, maxWidth = 'sm', ...props }) => {
  if (!open) return null;

  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      {...props}
    >
      <div
        className={`bg-white rounded-lg shadow-xl ${maxWidthClasses[maxWidth]} w-11/12`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogTitle = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-200 font-bold text-lg ${className}`} {...props}>
    {children}
  </div>
);

export const DialogContent = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 max-h-96 overflow-y-auto ${className}`} {...props}>
    {children}
  </div>
);

export const DialogContentText = ({ children, className = '', ...props }) => (
  <p className={`text-gray-600 text-sm ${className}`} {...props}>
    {children}
  </p>
);

export const DialogActions = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-3 border-t border-gray-200 flex justify-end gap-2 ${className}`} {...props}>
    {children}
  </div>
);

export default Dialog;
