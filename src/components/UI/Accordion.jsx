import React, { useState } from 'react';

const Accordion = ({
  children,
  defaultExpanded = false,
  disabled = false,
  sx = {},
  className = '',
  ...props
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const baseStyle = {
    border: '1px solid #e0e0e0',
    marginBottom: '8px',
    borderRadius: '4px',
    ...sx,
  };

  return (
    <div style={baseStyle} className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            expanded,
            setExpanded,
            disabled: disabled || child.props.disabled,
          });
        }
        return child;
      })}
    </div>
  );
};

export default Accordion;
