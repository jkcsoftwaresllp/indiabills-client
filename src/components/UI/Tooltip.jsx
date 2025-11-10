// Replacement for @mui/material Tooltip
import { useState } from 'react';

export const Tooltip = ({
  title,
  children,
  placement = 'top',
  className = '',
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const placementClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      {...props}
    >
      {children}
      {showTooltip && (
        <div
          className={`absolute whitespace-nowrap bg-gray-900 text-white px-2 py-1 rounded text-xs z-50 ${placementClasses[placement]} ${className}`}
        >
          {title}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
