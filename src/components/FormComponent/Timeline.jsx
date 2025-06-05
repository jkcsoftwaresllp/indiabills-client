import { FC } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from './styles/Stepper.module.css';

const Stepper = ({ steps, currentStep }) => {
  return (
  <div className={styles.container}>
    {steps?.map((step, i) => (
      <div
        key={i}
        className={`${styles.stepItem} ${
          currentStep === i + 1 ? styles.active : ''
        } ${i + 1 < currentStep ? styles.complete : ''}`}
      >
        <div className={styles.step}>
          {i + 1 < currentStep ? <CheckCircleIcon /> : i + 1}
        </div>
        <p className={styles.stepText}>{step}</p>
      </div>
    ))}
  </div>
);
};

export default Stepper;
