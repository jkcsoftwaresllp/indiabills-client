import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {styled} from "@mui/system";
import {Paper, Popper} from "@mui/material";
// import { Field, Services } from "../../definitions/Types";


const DropdownStream = ({field, options, required, handleChange, moreVisible}) => {

    const CustomPopper = styled(Popper)(({ theme }) => ({
        zIndex: 6000,
        '& .MuiAutocomplete-listbox': {
            backgroundColor: "white",
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            padding: "0",
        },
    }));

    const CustomPaper = styled(Paper)(({ theme }) => ({
        backgroundColor: "white",
        backdropFilter: "blur(10px)",
        borderRadius: "10px",
        padding: "8px",
    }));

    return (
            <div className={"w-full idms-transparent-bg"}>
                <Autocomplete
                    className="w-full"
                    options={options}
                    aria-required={required}
                    PopperComponent={CustomPopper}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                // border: !moreVisible && 'none',
                                borderRadius: '1rem',
                            },
                        },
                    }}
                    PaperComponent={CustomPaper}
                    getOptionLabel={(option) => option.toString()}
                    renderInput={(params) => (
                        <TextField {...params} label={field.label} variant="outlined" fullWidth/>
                    )}
                    onChange={(e, value) => handleChange("autocomplete", field.name, value)(e)}
                />
            </div>
    );
};

export default DropdownStream;
