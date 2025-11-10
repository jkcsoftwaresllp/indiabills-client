// Replacement for @mui/material Modal
export const Modal = ({ open, onClose, children, className = '', ...props }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      {...props}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-11/12 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
