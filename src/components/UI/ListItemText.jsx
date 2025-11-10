
const ListItemText = ({
  primary,
  secondary,
  primaryTypographyProps = {},
  secondaryTypographyProps = {},
  sx = {},
  className = '',
  ...props
}) => {
  const baseStyle = {
    padding: '0',
    ...sx,
  };

  return (
    <div style={baseStyle} className={className} {...props}>
      {primary && (
        <div
          style={{
            fontWeight: '500',
            fontSize: '14px',
            color: '#333',
            ...primaryTypographyProps.style,
          }}
          {...primaryTypographyProps}
        >
          {primary}
        </div>
      )}
      {secondary && (
        <div
          style={{
            fontSize: '12px',
            color: '#999',
            marginTop: '4px',
            ...secondaryTypographyProps.style,
          }}
          {...secondaryTypographyProps}
        >
          {secondary}
        </div>
      )}
    </div>
  );
};

export default ListItemText;
