
const Radio = ({
  value,
  checked = false,
  onChange,
  disabled = false,
  name,
  sx = {},
  className = '',
  color = 'primary',
  ...props
}) => {
  const colorMap = {
    primary: '#1976d2',
    secondary: '#dc004e',
    error: '#d32f2f',
    warning: '#ed6c02',
    info: '#0288d1',
    success: '#388e3c',
  };

  const baseStyle = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    accentColor: colorMap[color] || color,
    ...sx,
  };

  return (
    <input
      type="radio"
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      name={name}
      style={baseStyle}
      className={className}
      {...props}
    />
  );
};

export default Radio;
