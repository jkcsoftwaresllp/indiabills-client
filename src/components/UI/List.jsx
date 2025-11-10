
const List = ({
  children,
  dense = false,
  sx = {},
  className = '',
  ...props
}) => {
  const baseStyle = {
    listStyle: 'none',
    padding: dense ? '4px 0' : '8px 0',
    margin: '0',
    ...sx,
  };

  return (
    <ul style={baseStyle} className={className} {...props}>
      {children}
    </ul>
  );
};

export default List;
