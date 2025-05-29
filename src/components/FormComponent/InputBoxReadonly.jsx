import TextField from "@mui/material/TextField";
import {apiTypes, formTypes} from "../../types";

const InputBoxReadonly = ({field, value,}) => {

    const name = field.name;
    const label = field.label;
    let type = field.type;

    /* Since there's no date type in JavaScript,
       so I've purposefully added "date" as a suffix in the schema name for each date field
       therefore, we can easily recognize them by: */

    if (!value) {
        type = "text"
        value = "N/A"
    } else {
        if (name.toLowerCase().includes("date")) {
            value = new Date(value)
                .toISOString()
                .split('T')[0];
        }
    }

    return (
        <TextField
            variant="outlined"
            id={name}
            name={name}
            label={label}
            type={type}
            defaultValue={value}
            InputProps={{
                readOnly: true,
            }}
        />
    );
};

export default InputBoxReadonly;
