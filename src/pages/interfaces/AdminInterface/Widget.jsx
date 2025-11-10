
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
    <div style={{ background: '#f0f0f0', padding: '10px', height: '100%', position: 'relative' }}>
      <button
        onClick={() => removeWidget(widgetKey)}
        style={{ position: 'absolute', top: 5, right: 5 }}
      >
        ×
      </button>
      {renderContent()}
    </div>
  );
};

export default Widget;