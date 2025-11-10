import {
  TextField,
  Autocomplete,
  Paper,
  Popper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";

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

const Dropdown = ({
  name,
  label,
  options = [],
  selectedData,
  setValue,
  required = false,
  error,
  helperText,
  variant = "autocomplete", // "autocomplete" | "select"
  ...props
}) => {
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAutoCompleteChange = (event, newValue) => {
    setValue((prev) => ({
      ...prev,
      [name]: newValue || "",
    }));
  };

  if (variant === "select") {
    return (
      <FormControl fullWidth variant="outlined" size="small" error={!!error}>
        <InputLabel>{label}</InputLabel>
        <Select
          name={name}
          value={selectedData[name] || ""}
          onChange={handleSelectChange}
          label={label}
          required={required}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {capitalize(option)}
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <p className="text-sm text-red-500 mt-1">{helperText}</p>
        )}
      </FormControl>
    );
  }

  // Default: Autocomplete
  return (
    <Autocomplete
      id={name}
      options={options}
      isOptionEqualToValue={(option, value) => option === value}
      value={selectedData[name] ? selectedData[name] : null}
      getOptionLabel={(option) => capitalize(option)}
      aria-required={required}
      PopperComponent={(props) => (
        <CustomPopper
          {...props}
          modifiers={[
            {
              name: "zIndex",
              options: { zIndex: 6000 },
            },
          ]}
        />
      )}
      PaperComponent={CustomPaper}
      sx={{
        "& .MuiOutlinedInput-root": {
          backgroundColor: "rgb(245, 247, 252)",
          borderRadius: "1rem",
          "& fieldset": {
            borderColor: "rgba(38, 38, 38, 0.18)",
            boxShadow: "0.1px 0.2px 4px rgba(38, 38, 38, 0.18)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(38, 38, 38, 0.5)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "rgba(38, 38, 38, 0.7)",
          },
          "& .MuiOutlinedInput-input": {
            color: "rgb(68, 68, 68)",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#666",
            opacity: 1,
          },
        },
        "& .MuiInputLabel-root": {
          color: "rgb(68, 68, 68)",
          textTransform: "capitalize",
        },
      }}
      onChange={handleAutoCompleteChange}
      renderOption={(props, option) => (
        <li {...props} style={{ textTransform: "capitalize" }}>
          {capitalize(option)}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          error={!!error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            value: selectedData[name] ? capitalize(selectedData[name]) : "",
          }}
        />
      )}
    />
  );
};

export default Dropdown;
