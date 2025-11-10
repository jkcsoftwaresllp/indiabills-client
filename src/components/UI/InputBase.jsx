
const InputBase = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  readOnly = false,
  startAdornment,
  endAdornment,
  sx = {},
  className = '',
  inputProps = {},
  multiline = false,
  rows = 1,
  ...props
}) => {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontFamily: 'inherit',
    fontSize: '14px',
    ...sx,
  };

  const inputStyle = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
  };

  const inputElement = multiline ? (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      rows={rows}
      style={inputStyle}
      {...inputProps}
      {...props}
    />
  ) : (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      style={inputStyle}
      {...inputProps}
      {...props}
    />
  );

  return (
    <div style={baseStyle} className={className}>
      {startAdornment && <span style={{ marginRight: '8px' }}>{startAdornment}</span>}
      {inputElement}
      {endAdornment && <span style={{ marginLeft: '8px' }}>{endAdornment}</span>}
    </div>
  );
};

export default InputBase;
