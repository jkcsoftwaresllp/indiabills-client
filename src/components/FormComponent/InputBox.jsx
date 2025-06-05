import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import styles from './styles/InputBox.module.css';

const InputBox = ({
    name,
    small,
    type,
    label,
    error,
    helperText,
    readonly,
    minLength,
    maxLength,
    placeholder,
    required,
    startText,
    endText,
    value,
    onChange,
    min,
    max,
    multiline,
    maxRows,
}) => {

    const generateLabel = (name) => {
        return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    return (
        <TextField
            fullWidth
            variant="outlined"
            name={name}
            label={label || generateLabel(name)}
            type={type !== 'string' ? type : 'text'} // Ensure 'text' is used instead of 'string'
            required={required}
            error={!!error}
            helperText={helperText}
            multiline={multiline}
            maxRows={multiline ? maxRows : undefined}
            placeholder={placeholder}
            value={value !== undefined && value !== null ? value : ''}
            inputProps={{
                ...(min !== undefined && { min: min }),
                ...(max !== undefined && { max: max }),
                ...(minLength !== undefined && { minLength: minLength }),
                ...(maxLength !== undefined && { maxLength: maxLength }),
                readOnly: readonly,
            }}
            InputLabelProps={{
                shrink: true
            }}
           InputProps={{
  startAdornment: startText ? (
    <InputAdornment position="start">
      <span className={`${styles.adornmentText} ${styles.startText}`}>
        {startText}
      </span>
    </InputAdornment>
  ) : undefined,
  endAdornment: endText ? (
    <InputAdornment position="end">
      <span className={`${styles.adornmentText} ${styles.endText}`}>
        {endText}
      </span>
    </InputAdornment>
  ) : undefined,
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
            onChange={onChange}
        />
    );
};

export default InputBox;