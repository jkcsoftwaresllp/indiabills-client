import React, { useState, useEffect } from 'react';

const Collapse = ({ 
  in: open = false,
  timeout = 300,
  children,
  sx = {},
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(open);
  const [height, setHeight] = useState(0);
  const contentRef = React.useRef(null);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
      }
    } else {
      setHeight(0);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [open, timeout]);

  const baseStyle = {
    overflow: 'hidden',
    transition: `height ${timeout}ms ease-in-out`,
    height: height,
    ...sx,
  };

  return (
    isVisible && (
      <div
        ref={contentRef}
        style={baseStyle}
        className={className}
        {...props}
      >
        {children}
      </div>
    )
  );
};

export default Collapse;
