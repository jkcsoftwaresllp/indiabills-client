// Replacement for @mui/material Card components
export const Card = ({ children, className = '', sx = {}, ...props }) => (
  <div
    className={`rounded-lg bg-white shadow-md ${className}`}
    style={sx}
    {...props}
  >
    {children}
  </div>
);

export const CardContent = ({ children, className = '', sx = {}, ...props }) => (
  <div className={`p-4 ${className}`} style={sx} {...props}>
    {children}
  </div>
);

export const CardActions = ({ children, className = '', sx = {}, ...props }) => (
  <div className={`px-4 py-3 border-t border-gray-200 flex gap-2 ${className}`} style={sx} {...props}>
    {children}
  </div>
);

export default Card;
