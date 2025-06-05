import React from "react";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import styles from './styles/DropdownInput.module.css';

export const DropdownInput = ({ label, name, value, onChange, error, help, startText, endText, options, objectOptions }) => {
    return (
  <div className={styles.container}>
    <label className={styles.label} htmlFor={name}>
      {label}
    </label>
    <div className={styles.wrapper}>
      {startText && <span style={{ marginLeft: '0.5rem' }}>{startText}</span>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={styles.select}
      >
        {options ? (
          <>
            <option disabled value="">
              Select a {label}
            </option>
            {options.map((option) => (
              <option key={option} className={styles.option} value={option}>
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
              <option key={option.id} className={styles.option} value={option.id}>
                {option.name}
              </option>
            ))}
          </>
        )}
      </select>
      <UnfoldMoreIcon fontSize="small" className={styles.icon} />
      {endText && <span style={{ marginRight: '0.75rem' }}>{endText}</span>}
    </div>
    {error && <small className={styles.error}>{error}</small>}
    {help && <small className={styles.help}>{help}</small>}
  </div>
);
}