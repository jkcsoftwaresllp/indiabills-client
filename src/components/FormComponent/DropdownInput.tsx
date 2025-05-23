import React from "react";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

interface Props {
    label: string;
    name: string;
    value: any;
    onChange: any;
    error?: string;
    help?: string;
    startText?: string;
    endText?: string;
    options?: string[];
    objectOptions?: { id: string, name: string }[];
}

export const DropdownInput: React.FC<Props> = ({ label, name, value, onChange, error, help, startText, endText, options, objectOptions }) => {
    return (
        <div className={"flex flex-col gap-2"}>
            <label className={"label-custom"} htmlFor={name}>{label}</label>
            <div className="relative flex items-center p-0.5 shadow-sm hover:shadow-md bg-white border border-gray-300 rounded-lg transition-colors duration-300 hover:border-rose-500 focus-within:border-rose-500">
                {startText && <span className="ml-2">{startText}</span>}
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={
                        "flex-grow appearance-none bg-transparent p-2 pr-8 focus:outline-none"
                    }
                >
                    {options ? (
                        <>
                            <option disabled value="">
                                Select a {label}
                            </option>
                            {options.map((option) => (
                                <option key={option} className={'capitalize'} value={option}>
                                    {option}
                                </option>
                            ))}
                        </>
                    ) : (
                        <>
                            <option disabled value="">
                                Select an option
                            </option>
                            {objectOptions?.map((option) => (
                                <option key={option.id} className={'capitalize'} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </>
                    )}
                </select>
                <UnfoldMoreIcon fontSize="small" className="absolute right-2 text-gray-500 pointer-events-none" />
                {endText && <span className="mr-3">{endText}</span>}
            </div>
            {error && <small className={'text-red-600 ml-1'}>{error}</small>}
            {help && <small className={'ml-1'}>{help}</small>}
        </div>
    );
}