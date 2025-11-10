// Replacement for @mui/material TextField
export const TextField = ({
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  type = 'text',
  variant = 'outlined',
  disabled = false,
  error = false,
  helperText = '',
  multiline = false,
  rows = 4,
  className = '',
  fullWidth = false,
  defaultValue,
  inputProps = {},
  startAdornment,
  endAdornment,
  ...props
}) => {
  const baseClasses = 'px-3 py-2 border rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500';
  const variantClasses = {
    outlined: error ? 'border-red-500 bg-white' : 'border-gray-300 bg-white',
    filled: error ? 'border-b-2 border-red-500 bg-gray-100' : 'border-b-2 border-gray-300 bg-gray-100',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '';
  const fullWidthClass = fullWidth ? 'w-full' : '';
  
  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${fullWidthClass} ${className}`.trim();

  const Input = multiline ? 'textarea' : 'input';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {startAdornment && (
          <span className="absolute left-3 text-gray-500">{startAdornment}</span>
        )}
        <Input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={disabled}
          rows={multiline ? rows : undefined}
          className={`${finalClassName} ${startAdornment ? 'pl-10' : ''} ${endAdornment ? 'pr-10' : ''}`}
          style={{
            resize: multiline ? 'vertical' : 'none',
          }}
          {...inputProps}
          {...props}
        />
        {endAdornment && (
          <span className="absolute right-3 text-gray-500">{endAdornment}</span>
        )}
      </div>
      {helperText && (
        <p className={`text-sm mt-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default TextField;
