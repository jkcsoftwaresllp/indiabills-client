import { useState, useEffect } from 'react';

const Slide = ({
  in: open = false,
  direction = 'up',
  timeout = 300,
  children,
  sx = {},
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [open, timeout]);

  if (!isVisible && !open) {
    return null;
  }

  const directionMap = {
    up: { transform: open ? 'translateY(0)' : 'translateY(100%)' },
    down: { transform: open ? 'translateY(0)' : 'translateY(-100%)' },
    left: { transform: open ? 'translateX(0)' : 'translateX(100%)' },
    right: { transform: open ? 'translateX(0)' : 'translateX(-100%)' },
  };

  const baseStyle = {
    transition: `transform ${timeout}ms ease-in-out`,
    ...directionMap[direction],
    ...sx,
  };

  return (
    <div style={baseStyle} className={className} {...props}>
      {children}
    </div>
  );
};

export default Slide;
