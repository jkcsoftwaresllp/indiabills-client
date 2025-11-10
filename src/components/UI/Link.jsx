
const Link = ({ 
  href, 
  children, 
  onClick,
  color = 'primary',
  underline = 'hover',
  sx = {},
  className = '',
  ...props 
}) => {
  const colorMap = {
    primary: '#1976d2',
    secondary: '#dc004e',
    error: '#d32f2f',
    warning: '#ed6c02',
    info: '#0288d1',
    success: '#388e3c',
    inherit: 'inherit',
  };

  const underlineMap = {
    none: 'none',
    hover: 'underline',
    always: 'underline',
  };

  const baseStyle = {
    cursor: 'pointer',
    color: colorMap[color] || color,
    textDecoration: underlineMap[underline] || 'underline',
    transition: 'color 0.2s ease',
    ...sx,
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (href) {
      window.location.href = href;
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      style={baseStyle}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
