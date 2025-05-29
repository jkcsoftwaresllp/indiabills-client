import React from "react";

const SearchBar = ({ setSearchFieldByName, className, value, title }) => {
	const baseClasses = "px-4 py-2 border rounded-lg outline-none";
	const combinedClasses = className
		? `${baseClasses} ${className}`
		: baseClasses;

	return (
		<input
			className={combinedClasses}
			placeholder={`Search for ${title}`}
			type="text"
			value={value}
			onChange={(event) => setSearchFieldByName(event.target.value)}
		/>
	);
};

export default SearchBar;
