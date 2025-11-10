
export const BigTextInput = ({ label, name, value, onChange, error, help, maxlength, placeholder }) => {
    return (
        <div className={"flex flex-col gap-2 transition-colors duration-300"}>
            <label className={"label-custom"} htmlFor={name}>{label}</label>
            <textarea
                id={name}
                placeholder={placeholder}
                maxLength={maxlength}
                className={"border border-gray-300 shadow-sm hover:shadow-md p-2 rounded-lg focus:outline-none transition-colors duration-300 hover:border-rose-500 focus-within:border-rose-500"}
                name={name}
                value={value}
                onChange={onChange}
            />
            {error && <small className={'text-red-600 ml-1'}>{error}</small>}
            {help && <small className={'ml-1'}>{help}</small>}
        </div>
    );
}