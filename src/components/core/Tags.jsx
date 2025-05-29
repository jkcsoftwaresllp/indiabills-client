import { Autocomplete, TextField } from "@mui/material";

const Tags = ({ options, handleChange, selectedValue }) => (
	<Autocomplete
		multiple
		options={options}
		getOptionLabel={(option) => option.name}
		value={selectedValue}
		onChange={handleChange}
		renderInput={(params) => (
			<TextField
				{...params}
				variant="outlined"
				label="Select Products"
				placeholder="Products"
			/>
		)}
		style={{ width: 300 }}
	/>
);

export default Tags;