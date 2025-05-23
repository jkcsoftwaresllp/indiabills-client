import React from 'react';
import TextField from '@mui/material/TextField';
import * as types from '../../definitions/Types';

interface Props<T extends types.Services, K extends types.Field<T>> {
  field: K | types.Field<types.Batch> | types.Field<types.Location>,
  value: T[keyof T];
  required?: boolean;
  disabled?: boolean;
  moreVisible?: boolean;
  handleChange: (type: string, target: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputBoxStream = <T extends types.Services, K extends types.Field<T>>({ field, value, handleChange, disabled, required, moreVisible }: Props<T, K>) => {

  // console.log(field, value);

  const name = field.name as string;
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
