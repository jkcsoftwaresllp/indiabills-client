// Replacement for @mui/material Popover

export const Popover = ({
  open = false,
  onClose,
  children,
  anchorEl,
  className = '',
  ...props
}) => {
  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect?.();

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={onClose}
      {...props}
    >
      <div
        className={`absolute bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 ${className}`}
        style={{
          top: rect?.bottom + 8 || 0,
          left: rect?.left || 0,
          width: 'auto',
          minWidth: rect?.width || 200,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Popover;
