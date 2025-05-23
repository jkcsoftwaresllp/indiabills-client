import { Autocomplete, TextField } from "@mui/material";
import { FC } from "react";

interface Props {
	options: any;
	handleChange: any;
	selectedValue: any;
}

const Tags: FC<Props> = ({ options, handleChange, selectedValue }) => (
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