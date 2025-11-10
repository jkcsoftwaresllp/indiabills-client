const Tab = ({
  label,
  value,
  disabled = false,
  selected = false,
  onClick,
  sx = {},
  className = '',
  icon,
  iconPosition = 'top',
  ...props
}) => {
  const baseStyle = {
    padding: '12px 16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    borderBottom: selected ? '3px solid #1976d2' : '3px solid transparent',
    color: selected ? '#1976d2' : '#666',
    fontSize: '14px',
    fontWeight: selected ? '600' : '400',
    transition: 'all 0.3s ease',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexDirection: iconPosition === 'top' || iconPosition === 'bottom' ? 'column' : 'row',
    ...sx,
  };
  return (
    <button
      style={baseStyle}
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
};
export default Tab;