import React from 'react';
import styles from './styles/Widget.module.css';

const Widget = ({ widgetKey, removeWidget }) => {
  const renderContent = () => {
    switch (widgetKey) {
      case 'inventoryStatus':
        return <div>Inventory Status Content</div>;
      case 'salesReport':
        return <div>Sales Report Content</div>;
      case 'purchaseOrders':
        return <div>Purchase Orders Content</div>;
      case 'lowStock':
        return <div>Low Stock Items Content</div>;
      case 'topProducts':
        return <div>Top Products Content</div>;
      default:
        return <div>Unknown Widget</div>;
    }
  };

 return (
  <div className={styles.container}>
    <button
      onClick={() => removeWidget(widgetKey)}
      className={styles.closeBtn}
      aria-label="Remove widget"
    >
      ×
    </button>
    {renderContent()}
  </div>
);
};

export default Widget;