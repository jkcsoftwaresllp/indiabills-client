// Replacement for @mui/material MenuItem
export const MenuItem = ({
  children,
  value,
  disabled = false,
  className = '',
  ...props
}) => (
  <option value={value} disabled={disabled} className={className} {...props}>
    {children}
  </option>
);

export default MenuItem;
