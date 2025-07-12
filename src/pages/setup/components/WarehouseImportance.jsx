import React from 'react';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import styles from './ImportanceCard.module.css';

const WarehouseImportance = ({ onContinueSetup }) => {
  const benefits = [
    {
      icon: <InventoryIcon />,
      title: 'Inventory Management',
      description: 'Track stock levels, manage products, and monitor inventory across locations'
    },
    {
      icon: <LocalShippingIcon />,
      title: 'Order Fulfillment',
      description: 'Efficiently process orders and manage shipping from your warehouse locations'
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Business Analytics',
      description: 'Generate reports and insights based on warehouse performance and inventory data'
    },
    {
      icon: <WarehouseIcon />,
      title: 'Multi-Location Support',
      description: 'Manage multiple warehouse locations and distribute inventory effectively'
    }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <WarehouseIcon className={styles.headerIcon} />
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