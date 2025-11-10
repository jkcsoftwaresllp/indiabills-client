
const RadioGroup = ({
  value,
  onChange,
  children,
  row = false,
  sx = {},
  className = '',
  ...props
}) => {
  const baseStyle = {
    display: 'flex',
    flexDirection: row ? 'row' : 'column',
    gap: '12px',
    ...sx,
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div
      style={baseStyle}
      className={className}
      role="group"
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onChange: handleChange,
          });
        }
        return child;
      })}
    </div>
  );
};

export default RadioGroup;
