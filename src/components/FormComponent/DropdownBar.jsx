import {Autocomplete, TextField} from "@mui/material";
import {CustomPaper, CustomPopper} from "../../utils/FormHelper";

const DropdownBar = ({ data, setSelectedData, selectedData, label }) => {

    return (
        <div className={"idms-control min-w-fit z-[6000]"}>
            <Autocomplete
                id={label}
                options={data}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedData}
                PopperComponent={CustomPopper}
                PaperComponent={CustomPaper} 
                onChange={(event, newValue) => setSelectedData(newValue)}
                sx={{width: "100%", zIndex: '6001' }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    border: "none",
                                },
                            },
                        }}
                    />
                )}
            />
        </div>
    );
};

export default DropdownBar;
