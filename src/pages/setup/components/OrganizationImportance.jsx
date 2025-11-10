import { FiBriefcase, FiEdit3, FiFileText, FiLock, FiPlus } from 'react-icons/fi';
import React from 'react';
import styles from './ImportanceCard.module.css';

const OrganizationImportance = ({ onStartSetup }) => {
  const benefits = [
    {
      icon: <FiBriefcase />,
      title: 'Professional Identity',
      description: 'Establish your business identity with proper branding and contact information'
    },
    {
      icon: <FiEdit3 />,
      title: 'Custom Branding',
      description: 'FiPlus your logo, colors, and branding to all invoices and documents'
    },
    {
      icon: <FiFileText />,
      title: 'Legal Compliance',
      description: 'Ensure all invoices and documents meet legal requirements with proper business details'
    },
    {
      icon: <FiLock />,
      title: 'Data Security',
      description: 'Secure your business data with proper organization-level access controls'
    }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <FiBriefcase className={styles.headerIcon} />
        <div>
          <h2 className={styles.title}>Organization Setup Required</h2>
          <p className={styles.subtitle}>
            Setting up your organization is the foundation of your business management system
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.sectionTitle}>Why Organization Setup is Critical:</h3>
        
        <div className={styles.benefitsList}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.benefit}>
              <div className={styles.benefitIcon}>
                {benefit.icon}
              </div>
              <div className={styles.benefitContent}>
                <h4 className={styles.benefitTitle}>{benefit.title}</h4>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.warningBox}>
          <h4 className={styles.warningTitle}>⚠️ Important Note</h4>
          <p className={styles.warningText}>
            Without proper organization setup, you won't be able to generate professional invoices, 
            maintain legal compliance, or effectively manage your business operations.
          </p>
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          className={styles.primaryButton}
          onClick={onStartSetup}
        >
          Start Organization Setup
        </button>
      </div>
    </div>
  );
};

export default OrganizationImportance;