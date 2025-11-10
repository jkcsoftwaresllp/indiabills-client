// Replacement for @mui/material Rating
export const Rating = ({
  value = 0,
  onChange,
  readOnly = false,
  max = 5,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex gap-1 ${className}`} {...props}>
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          onClick={() => !readOnly && onChange?.(i + 1)}
          disabled={readOnly}
          className={`text-2xl transition-colors ${
            i < value ? 'text-yellow-400' : 'text-gray-300'
          } ${readOnly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default Rating;
