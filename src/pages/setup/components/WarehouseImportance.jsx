import { FiBarChart2, FiBox, FiHeadphones, FiTruck } from 'react-icons/fi';
import React from 'react';
import styles from './ImportanceCard.module.css';

const WarehouseImportance = ({ onContinueSetup }) => {
  const benefits = [
    {
      icon: <FiBox />,
      title: 'Inventory Management',
      description: 'Track stock levels, manage products, and monitor inventory across locations'
    },
    {
      icon: <FiTruck />,
      title: 'Order Fulfillment',
      description: 'Efficiently process orders and manage shipping from your warehouse locations'
    },
    {
      icon: <FiBarChart2 />,
      title: 'Business Analytics',
      description: 'Generate reports and insights based on warehouse performance and inventory data'
    },
    {
      icon: <FiBox />,
      title: 'Multi-Location FiHeadphones',
      description: 'Manage multiple warehouse locations and distribute inventory effectively'
    }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <FiBox className={styles.headerIcon} />
        <div>
          <h2 className={styles.title}>Warehouse Setup Required</h2>
          <p className={styles.subtitle}>
            Configure your warehouse to enable inventory management and order processing
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.sectionTitle}>Why Warehouse Setup is Essential:</h3>
        
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

        <div className={styles.infoBox}>
          <h4 className={styles.infoTitle}>✅ Organization Setup Complete</h4>
          <p className={styles.infoText}>
            Great! Your organization is set up. Now let's configure your warehouse 
            to start managing inventory and processing orders.
          </p>
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          className={styles.primaryButton}
          onClick={onContinueSetup}
        >
          Continue to Warehouse Setup
        </button>
      </div>
    </div>
  );
};

export default WarehouseImportance;