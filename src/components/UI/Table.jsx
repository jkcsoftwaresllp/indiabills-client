// Replacement for @mui/material Table components
export const Table = ({ children, className = '', sx = {}, ...props }) => (
  <table className={`w-full border-collapse ${className}`} style={sx} {...props}>
    {children}
  </table>
);

export const TableContainer = ({ children, className = '', sx = {}, ...props }) => (
  <div className={`overflow-x-auto ${className}`} style={sx} {...props}>
    {children}
  </div>
);

export const TableHead = ({ children, className = '', sx = {}, ...props }) => (
  <thead className={`bg-gray-100 ${className}`} style={sx} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = '', sx = {}, ...props }) => (
  <tbody className={className} style={sx} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '', sx = {}, hover = false, ...props }) => (
  <tr
    className={`border-b border-gray-200 ${hover ? 'hover:bg-gray-50' : ''} ${className}`}
    style={sx}
    {...props}
  >
    {children}
  </tr>
);

export const TableCell = ({
  children,
  className = '',
  sx = {},
  align = 'inherit',
  padding = 'normal',
  ...props
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
    inherit: 'text-inherit',
  }[align] || 'text-left';

  const paddingClass = {
    none: 'p-0',
    checkbox: 'px-2 py-1',
    normal: 'px-4 py-2',
  }[padding] || 'px-4 py-2';

  return (
    <td className={`${alignClass} ${paddingClass} ${className}`} style={sx} {...props}>
      {children}
    </td>
  );
};

export default Table;
