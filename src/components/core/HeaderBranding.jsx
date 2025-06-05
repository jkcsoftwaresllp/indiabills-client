import React from "react";
import styles from './styles/HeaderBranding.module.css';


const HeaderBranding = ({first_title, last_title}) => (
    <div id="logo">
    <h1 className={styles.logoTitle}>
      {first_title}
      <span className={styles.gradientText}>
        {last_title}
      </span>
    </h1>
  </div>
);

export default HeaderBranding;