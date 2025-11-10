
const TablePagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  sx = {},
  className = '',
  ...props
}) => {
  const startIndex = page * rowsPerPage + 1;
  const endIndex = Math.min((page + 1) * rowsPerPage, count);

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#fafafa',
    ...sx,
  };

  const handlePreviousClick = () => {
    if (page > 0) {
      onPageChange(null, page - 1);
    }
  };

  const handleNextClick = () => {
    if ((page + 1) * rowsPerPage < count) {
      onPageChange(null, page + 1);
    }
  };

  const handleRowsPerPageChange = (e) => {
    onRowsPerPageChange(e);
  };

  return (
    <div style={baseStyle} className={className} {...props}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label style={{ fontSize: '12px', color: '#666' }}>
          Rows per page:
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            style={{
              marginLeft: '8px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '12px',
            }}
          >
            {[5, 10, 25, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ fontSize: '12px', color: '#666' }}>
        {startIndex}-{endIndex} of {count}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handlePreviousClick}
          disabled={page === 0}
          style={{
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: page === 0 ? 'not-allowed' : 'pointer',
            opacity: page === 0 ? 0.5 : 1,
            fontSize: '12px',
          }}
        >
          Previous
        </button>
        <button
          onClick={handleNextClick}
          disabled={(page + 1) * rowsPerPage >= count}
          style={{
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: (page + 1) * rowsPerPage >= count ? 'not-allowed' : 'pointer',
            opacity: (page + 1) * rowsPerPage >= count ? 0.5 : 1,
            fontSize: '12px',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
