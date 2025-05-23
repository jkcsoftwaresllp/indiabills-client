import React from "react";

interface SearchBarProps {
    title: string
    value: string;

    className?: string
    setSearchFieldByName: React.Dispatch<React.SetStateAction<string>>,
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchFieldByName, className, value, title }) => {

    const baseClasses = "px-4 py-2 border rounded-lg outline-none";
    const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;

    return (

        <input
            className={combinedClasses}
            placeholder={`Search for ${title}`}
            type="text"
            value={value}
            onChange={(event) => setSearchFieldByName(event.target.value)}
        />
    )
}

export default SearchBar;