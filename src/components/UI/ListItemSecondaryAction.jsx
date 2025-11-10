
const ListItemSecondaryAction = ({
  children,
  sx = {},
  className = '',
  ...props
}) => {
  const baseStyle = {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    ...sx,
  };

  return (
    <div style={baseStyle} className={className} {...props}>
      {children}
    </div>
  );
};

export default ListItemSecondaryAction;
