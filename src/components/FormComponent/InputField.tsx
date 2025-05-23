import { TextField } from "@mui/material";
import { FC } from "react";

interface Props {
    type: string;
    name: string;
    label: string;
    value?: any;
    optional?: boolean;
    placeholder?: string;
    startText?: string;
    setData: any;
    limitWidth?: boolean;
}

const InputField: FC<Props> = ({ type, name, label, optional, setData, value, startText, limitWidth, placeholder }) => {
    return (
        <div className={`bg-input min-w-fit ${limitWidth ? 'max-w-2/3' : 'w-full'}`}>
            <TextField
                className={"numInp"}
                variant="outlined"
                label={label}
                name={name}
                {...(value && { defaultValue: value })}
                placeholder={placeholder}
                type={type}
                required={optional ? false : true}
                {...(startText && { InputProps: { startAdornment: <div className={"mr-1"}>{startText}</div> } })}
                sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderRadius: '1rem',
                        },
                    },
                }}
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
                onChange={(e) => setData((prev) => ({ ...prev, [name]: (type === 'number' ? Number(e.target.value) : (type === 'date' ? new Date(e.target.value) : e.target.value)) }))}
            />
        </div>
    );
};

export default InputField;