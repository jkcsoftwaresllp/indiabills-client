import React from "react";
import styles from './styles/TextInput.module.css';


export const TextInput = ({ label, name, value, onChange, error, help, maxlength, startText, placeholder, endText, width }) => {
    return (
  <div className={`${styles.container} ${width || ''}`}>
    <label className={styles.labelCustom} htmlFor={name}>{label}</label>
    <div className={styles.inputWrapper}>
      {startText && <span className={styles.startText}>{startText}</span>}
      <input
        type="text"
        id={name}
        placeholder={placeholder}
        maxLength={maxlength}
        className={styles.inputField}
        name={name}
        value={value}
        onChange={onChange}
      />
      {endText && <span className={styles.endText}>{endText}</span>}
    </div>
    {error && <small className={styles.errorText}>{error}</small>}
    {help && <small className={styles.helpText}>{help}</small>}
  </div>
);
}