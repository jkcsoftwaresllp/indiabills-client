import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/system";
import { Paper, Popper } from "@mui/material";
import React from "react";
import styles from './styles/Dropdown.module.css';

const Dropdown = ({ name, label, options, required, setValue, selectedData }) => {
  const CustomPopper = styled(Popper)(() => ({
    zIndex: 6000,
    "& .MuiAutocomplete-listbox": {
      backgroundColor: "white",
      backdropFilter: "blur(10px)",
      borderRadius: "10px",
      padding: "0",
    },
  }));

  const CustomPaper = styled(Paper)(() => ({
    zIndex: 6001,
    backgroundColor: "white",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    padding: "8px",
  }));

  const handleChange = (event, newValue) => {
    setValue((prev) => ({
      ...prev,
      [name]: newValue || "",
    }));
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
  <Autocomplete
    id={name}
    options={options}
    isOptionEqualToValue={(option, value) => option === value}
    value={selectedData[name] ?? null}
    getOptionLabel={(option) => capitalize(option)}
    aria-required={required}
    PopperComponent={(props) => (
      <CustomPopper
        {...props}
        modifiers={[{ name: "zIndex", options: { zIndex: 6000 } }]}
      />
    )}
    PaperComponent={CustomPaper}
    classes={{
      inputRoot: styles.inputRoot,
      input: styles.input,
      popupIndicator: styles.popupIndicator, // if you have one
    }}
    renderOption={(props, option) => (
      <li {...props} className={styles.option}>
        {capitalize(option)}
      </li>
    )}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        fullWidth
        InputLabelProps={{
          className: styles.label,
        }}
        InputProps={{
          ...params.InputProps,
          classes: {
            root: styles.inputRoot,
            input: styles.input,
            notchedOutline: styles.notchedOutline,
          },
        }}
      />
    )}
    onChange={handleChange}
  />
);
};

export default Dropdown;
