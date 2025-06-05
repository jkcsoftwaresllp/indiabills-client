// client/src/components/core/NavSection.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './styles/NavSection.module.css';


const NavSection = ({ buttons }) => {
  const navigate = useNavigate();

  return (
   <section className={styles.section}>
    {buttons.map((button, index) => (
      <button
        key={index}
        onClick={() => navigate(button.to)}
        className={styles.button}
      >
        {button.icon}
        <span className={styles.label}>{button.label}</span>
      </button>
    ))}
  </section>
  );
};

export default NavSection;