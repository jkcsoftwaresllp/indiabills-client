import { TextField, InputAdornment } from '@mui/material';

const InputBox = ({
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
  readonly = false,
  startText,
  endText,
  error,
  helperText,
  min,
  max,
  minLength,
  maxLength,
  multiline = false,
  maxRows,
  size = "small",
  ...props
}) => {

  const generateLabel = (fieldName) => {
    return fieldName
      ? fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
      : '';
  };

  return (
    <TextField
      name={name}
      type={type !== "string" ? type : "text"}
      label={label || generateLabel(name)}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={onChange}
      required={required}
      error={!!error}
      helperText={helperText || error}
      fullWidth
      variant="outlined"
      size={size}
      multiline={multiline}
      maxRows={multiline ? maxRows : undefined}
      inputProps={{
        ...(min !== undefined && { min }),
        ...(max !== undefined && { max }),
        ...(minLength !== undefined && { minLength }),
        ...(maxLength !== undefined && { maxLength }),
        readOnly: readonly,
      }}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        startAdornment: startText ? (
          <InputAdornment position="start">
            <span className="mr-1 font-semibold text-sky-700 break-keep text-nowrap w-fit">
              {startText}
            </span>
          </InputAdornment>
        ) : null,
        endAdornment: endText ? (
          <InputAdornment position="end">
            <span className="ml-1 font-semibold text-slate-700 break-keep text-nowrap w-fit">
              {endText}
            </span>
          </InputAdornment>
        ) : null,
      }}
      sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgb(245, 247, 252)', // Set desired background color
                    borderRadius: '1rem',
                    '& fieldset': {
                        borderColor: 'rgba(38, 38, 38, 0.18)', // Border color
                        boxShadow: '0.1px 0.2px 4px rgba(38, 38, 38, 0.18)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(38, 38, 38, 0.5)', // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'rgba(38, 38, 38, 0.7)', // Border color when focused
                    },
                },
                '& .MuiOutlinedInput-input': {
                    color: 'rgb(68, 68, 68)', // Text color
                },
                '& .MuiInputBase-input::placeholder': {
                    color: '#666', // Placeholder color
                    opacity: 1, // Ensure placeholder is fully opaque
                },
                '& .MuiInputLabel-root': {
                    color: 'rgb(68, 68, 68)', // Label color
                },
            }}
      {...props}
    />
  );
};

export default InputBox;