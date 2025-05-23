import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/system";
import { Paper, Popper } from "@mui/material";
import React from "react";

interface Props {
  options: string[];
  name: string;
  label: string;
  required?: boolean;
  selectedData: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
}

const Dropdown: React.FC<Props> = ({ name, label, options, required, setValue, selectedData, }) => {
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

  const handleChange = (event: unknown, newValue: string | null) => { setValue((prev: any) => ({ ...prev, [name]: newValue || "", })); };

  const capitalize = (str: string) => { return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); };

  return (
      <Autocomplete
        id={name}
        options={options}
        isOptionEqualToValue={(option, value) => option === value}
        value={selectedData[name] ? selectedData[name] : null}
        getOptionLabel={(option) => capitalize(option)}
        aria-required={required}
        PopperComponent={(props) => ( <CustomPopper {...props} modifiers={[ { name: "zIndex", options: { zIndex: 6000 } }, ]} /> )}
        PaperComponent={CustomPaper}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgb(245, 247, 252)", // Set desired background color
            borderRadius: "1rem",
            "& fieldset": {
              borderColor: "rgba(38, 38, 38, 0.18)", // Border color
              boxShadow: "0.1px 0.2px 4px rgba(38, 38, 38, 0.18)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(38, 38, 38, 0.5)", // Border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(38, 38, 38, 0.7)", // Border color when focused
            },
            "& .MuiOutlinedInput-input": {
              color: "rgb(68, 68, 68)", // Text color
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#666", // Placeholder color
              opacity: 1, // Ensure placeholder is fully opaque
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgb(68, 68, 68)", // Label color
            textTransform: "capitalize",
          },
        }}
        onChange={handleChange}
        renderOption={(props, option) => ( <li {...props} style={{ textTransform: "capitalize" }}> {capitalize(option)} </li> )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            fullWidth
            InputProps={{ ...params.InputProps, value: selectedData[name] ? capitalize(selectedData[name]) : "", }}
          />
        )}
      />
  );
};

export default Dropdown;
