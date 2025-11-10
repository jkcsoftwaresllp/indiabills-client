import React, {} from 'react';
const Tabs = ({
  value,
  onChange,
  children,
  variant = 'standard',
  sx = {},
  className = '',
  ...props
}) => {
  const baseStyle = {
    display: 'flex',
    borderBottom: variant === 'standard' ? '2px solid #e0e0e0' : 'none',
    ...sx,
  };
  return (
    <div style={baseStyle} className={className} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            selected: child.props.value === value,
            onClick: () => onChange && onChange(null, child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};
export default Tabs;