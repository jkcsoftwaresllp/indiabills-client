// Replacement for @mui/material Popper
export const Popper = ({
  open = false,
  anchorEl,
  children,
  placement = 'bottom',
  className = '',
  ...props
}) => {
  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect?.();

  const placementStyles = {
    top: {
      top: rect?.top - 10,
      left: rect?.left + rect?.width / 2,
      transform: 'translateX(-50%)',
    },
    bottom: {
      top: rect?.bottom + 10,
      left: rect?.left + rect?.width / 2,
      transform: 'translateX(-50%)',
    },
    left: {
      top: rect?.top + rect?.height / 2,
      left: rect?.left - 10,
      transform: 'translateY(-50%)',
    },
    right: {
      top: rect?.top + rect?.height / 2,
      left: rect?.right + 10,
      transform: 'translateY(-50%)',
    },
  };

  return (
    <div
      className={`fixed bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 ${className}`}
      style={placementStyles[placement]}
      {...props}
    >
      {children}
    </div>
  );
};

export default Popper;
