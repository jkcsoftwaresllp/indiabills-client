
const AccordionSummary = ({
  children,
  expandIcon,
  onClick,
  expanded = false,
  disabled = false,
  sx = {},
  className = '',
  setExpanded,
  ...props
}) => {
  const baseStyle = {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    userSelect: 'none',
    ...sx,
  };

  const handleClick = (e) => {
    if (!disabled) {
      if (setExpanded) {
        setExpanded((prev) => !prev);
      }
      if (onClick) {
        onClick(e);
      }
    }
  };

  return (
    <div
      style={baseStyle}
      className={className}
      onClick={handleClick}
      {...props}
    >
      <div style={{ flex: 1 }}>{children}</div>
      {expandIcon && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          {expandIcon}
        </div>
      )}
    </div>
  );
};

export default AccordionSummary;
