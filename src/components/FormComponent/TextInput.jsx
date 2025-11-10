
export const TextInput = ({ label, name, value, onChange, error, help, maxlength, startText, placeholder, endText, width }) => {
    return (
        <div className={`flex flex-col gap-2 ${width || ''}`}>
            <label className={"label-custom"} htmlFor={name}>{label}</label>
            <div className="flex items-center shadow-sm hover:shadow-md bg-white border border-gray-300 rounded-lg transition-colors duration-300 hover:border-rose-500 focus-within:border-rose-500">
                {startText && <span className="ml-2">{startText}</span>}
                <input
                    type="text"
                    id={name}
                    placeholder={placeholder}
                    maxLength={maxlength}
                    className={"w-full bg-transparent p-2 focus:outline-none "}
                    name={name}
                    value={value}
                    onChange={onChange}
                />
                {endText && <span className="mr-3">{endText}</span>}
            </div>
            {error && <small className={'text-red-600 ml-1'}>{error}</small>}
            {help && <small className={'ml-1'}>{help}</small>}
        </div>
    );
}