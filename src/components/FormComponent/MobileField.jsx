import {MuiTelInput} from "mui-tel-input";
import {FC} from "react";

const MobileField = ({ name, label, setData, data }) => {
    return (
        <div className={"w-full"}>
            <MuiTelInput
                sx={{
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderRadius: "1rem"
                        },
                    },
                    width: "100%",
                }}
                label={label}
                name={name}
                defaultCountry="IN"
                onlyCountries={["FR", "IN", "BE", "SA"]}
                InputProps={{ inputProps: { maxLength: 15 } }}
                placeholder={"XXXXXXX"}
                onChange={(value) => setData({ ...data, [name]: value })}
                value={data[name]}
            />
        </div>
    );
};

export default MobileField;