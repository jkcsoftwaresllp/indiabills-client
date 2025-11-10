import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import React from 'react';
import styles from './SetupProgress.module.css';

const SetupProgress = ({ progress, completedSteps, totalSteps, isComplete }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Setup Progress</h2>
        <div className={styles.progressStats}>
          <span className={styles.percentage}>{Math.round(progress)}%</span>
          <span className={styles.steps}>
            {completedSteps} of {totalSteps} steps completed
          </span>
        </div>
      </div>

      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className={styles.stepsList}>
        <div className={`${styles.step} ${completedSteps >= 1 ? styles.completed : ''}`}>
          {completedSteps >= 1 ? (
            <FiCheckCircle className={styles.stepIcon} />
          ) : (
            <FiCircle className={styles.stepIcon} />
          )}
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Organization Setup</h3>
            <p className={styles.stepDescription}>
              Configure your organization details, branding, and basic information
            </p>
          </div>
        </div>

        <div className={`${styles.step} ${completedSteps >= 2 ? styles.completed : ''}`}>
          {completedSteps >= 2 ? (
            <FiCheckCircle className={styles.stepIcon} />
          ) : (
            <FiCircle className={styles.stepIcon} />
          )}
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Warehouse Setup</h3>
            <p className={styles.stepDescription}>
              Set up your warehouse locations and inventory management
            </p>
          </div>
        </div>
      </div>

      {isComplete && (
        <div className={styles.completionBadge}>
          <FiCheckCircle className={styles.completionIcon} />
          <span>Setup Complete!</span>
        </div>
      )}
    </div>
  );
};

export default SetupProgress;