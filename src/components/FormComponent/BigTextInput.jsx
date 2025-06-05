import React from "react";
import styles from './styles/BigTextInput.module.css';


export const BigTextInput = ({ label, name, value, onChange, error, help, maxlength, placeholder }) => {
    return (
        <div className={styles.container}>
    <label className={styles.label} htmlFor={name}>{label}</label>
    <textarea
      id={name}
      placeholder={placeholder}
      maxLength={maxlength}
      className={styles.textarea}
      name={name}
      value={value}
      onChange={onChange}
    />
    {error && <small className={styles.error}>{error}</small>}
    {help && <small className={styles.help}>{help}</small>}
  </div>
    )
}