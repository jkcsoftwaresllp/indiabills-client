// Replacement for @mui/material FormControlLabel
export const FormControlLabel = ({
  control,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => (
  <label className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} {...props}>
    {control && (
      <div onClick={(e) => !disabled && onChange?.(e)}>
        {typeof control === 'function' ? control({ checked, onChange, disabled }) : control}
      </div>
    )}
    <span className="text-sm">{label}</span>
  </label>
);

export default FormControlLabel;
