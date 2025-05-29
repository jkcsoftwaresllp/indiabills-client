import React from 'react';
import TextField from '@mui/material/TextField';
// import * as types from '../../definitions/Types';

const InputBoxStream = ({ field, value, handleChange, disabled, required, moreVisible }) => {

  // console.log(field, value);

  const name = field.name;
  const label = field.label;
  const type = field.type;
  const placeholder = field.placeholder;

  return (
    <div className={"w-full bg-input"}>
      <TextField
        variant="outlined"
        id={name}
        label={label}
        name={name}
        type={type}
        required={required}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              // border: !moreVisible && 'none',
              borderRadius: '1rem',
            },
          },
        }}
        placeholder={placeholder}
        disabled={disabled}
        // defaultValue={type === 'string' || type === 'number' || type === "date" ? null : value}
        defaultValue={value ? value : null}
        inputProps={{
          /* this logic should not be here but whatever */
          min: name === 'packSize' ? 1 : 0,
        }}
        InputLabelProps={{
          shrink: true
        }}
        fullWidth
        onChange={(e) => handleChange(field.type, name)(e)} // mf typescript.
      />
    </div>
  );
};

export default InputBoxStream;
