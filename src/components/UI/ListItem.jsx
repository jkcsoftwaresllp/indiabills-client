
const ListItem = ({
  children,
  button = false,
  dense = false,
  disabled = false,
  divider = false,
  selected = false,
  onClick,
  sx = {},
  className = '',
  ...props
}) => {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: dense ? '4px 16px' : '8px 16px',
    cursor: button && !disabled ? 'pointer' : 'default',
    backgroundColor: selected ? '#f5f5f5' : 'transparent',
    borderBottom: divider ? '1px solid #e0e0e0' : 'none',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color 0.2s ease',
    '&:hover': button && !disabled ? { backgroundColor: '#f5f5f5' } : {},
    ...sx,
  };

  return (
    <li
      style={baseStyle}
      className={className}
      onClick={!disabled && button ? onClick : undefined}
      {...props}
    >
      {children}
    </li>
  );
};

export default ListItem;
