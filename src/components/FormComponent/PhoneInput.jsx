import { useState } from 'react';
const COUNTRY_CODES = {
  FR: "+33",
  IN: "+91",
  BE: "+32",
  SA: "+966",
};
const PhoneInput = ({
  label,
  name,
  defaultCountry = "IN",
  onlyCountries = ["FR", "IN", "BE", "SA"],
  InputProps = {},
  placeholder = "XXXXXXX",
  onChange,
  value,
  sx,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const handleChange = (e) => {
    let inputValue = e.target.value;
    
    // Remove any non-digit characters
    inputValue = inputValue.replace(/\D/g, "");
    
    // Limit to maxLength if specified
    const maxLength = InputProps?.inputProps?.maxLength;
    if (maxLength && inputValue.length > maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }
    
    onChange(inputValue);
  };
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        gap: "8px",
        flexDirection: "column",
      }}
    >
      {label && (
        <label
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#333",
            marginBottom: "4px",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: "flex",
          gap: "8px",
          width: "100%",
        }}
      >
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          style={{
            padding: "10px 12px",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            fontFamily: "inherit",
            fontSize: "14px",
            backgroundColor: "white",
            cursor: "pointer",
            minWidth: "80px",
          }}
        >
          {onlyCountries.map((country) => (
            <option key={country} value={country}>
              {country} {COUNTRY_CODES[country]}
            </option>
          ))}
        </select>
        <input
          type="tel"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          maxLength={InputProps?.inputProps?.maxLength || 15}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            fontFamily: "inherit",
            fontSize: "14px",
            backgroundColor: "white",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
};
export default PhoneInput;