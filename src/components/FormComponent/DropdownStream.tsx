import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {styled} from "@mui/system";
import {Paper, Popper} from "@mui/material";
import { Field, Services } from "../../definitions/Types";

interface Props<T extends Services> {
    field: Field<T>,
    options: string[],
    required: boolean,
    moreVisible?: boolean,
    handleChange: (type: string, target: string, value?: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => void
}

const DropdownStream = <T extends Services>({field, options, required, handleChange, moreVisible}: Props<T>) => {

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
                    onChange={(e, value) => handleChange("autocomplete", field.name as string, value)(e as React.ChangeEvent<HTMLInputElement>)}
                />
            </div>
    );
};

export default DropdownStream;
