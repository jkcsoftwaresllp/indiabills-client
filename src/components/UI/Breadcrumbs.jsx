// Replacement for @mui/material Breadcrumbs
export const Breadcrumbs = ({
  children,
  separator = '/',
  className = '',
  sx = {},
  ...props
}) => {
  const items = Array.isArray(children) ? children : [children];

  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`} style={sx} {...props}>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {item}
          {index < items.length - 1 && (
            <span className="text-gray-400">{separator}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
