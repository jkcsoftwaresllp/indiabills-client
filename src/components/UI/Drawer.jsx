// Replacement for @mui/material Drawer
export const Drawer = ({
  open,
  onClose,
  children,
  anchor = 'left',
  className = '',
  sx = {},
  ...props
}) => {
  if (!open) return null;

  const anchorClasses = {
    left: 'left-0',
    right: 'right-0',
    top: 'top-0',
    bottom: 'bottom-0',
  };

  const sizeClasses = {
    left: 'w-80',
    right: 'w-80',
    top: 'h-64',
    bottom: 'h-64',
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div
        className={`fixed ${anchorClasses[anchor]} top-0 bottom-0 ${sizeClasses[anchor]} bg-white shadow-lg z-50 overflow-y-auto ${className}`}
        style={sx}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

export default Drawer;
