
const AccordionDetails = ({
  children,
  expanded = false,
  sx = {},
  className = '',
  ...props
}) => {
  if (!expanded) {
    return null;
  }

  const baseStyle = {
    padding: '16px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#ffffff',
    ...sx,
  };

  return (
    <div style={baseStyle} className={className} {...props}>
      {children}
    </div>
  );
};

export default AccordionDetails;
