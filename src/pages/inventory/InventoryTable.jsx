import React from "react";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import styles from './styles/formatDate.module.css';

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const thClass = styles.th;

const InventoryTable = ({ entries }) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={`${thClass} ${styles.roundedLeft}`}> Batch ID </th>
            <th className={thClass}> Batch Number </th>
            <th className={thClass}> Items </th>
            <th className={thClass}> Batch Price </th>
            <th className={thClass}> Status </th>
            <th className={thClass}> Supplier Name </th>
            <th className={`${thClass} ${styles.roundedRight}`}> Entry Date </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <React.Fragment key={index}>
              <tr className={styles.row}>
                <td className={`${styles.td} ${styles.bold}`}> {entry.batchId} </td>
                <td className={styles.td}> {entry.batchNumber} </td>
                <td className={styles.td}>
                  <button
                    className={styles.expandButton}
                    onClick={() => {
                      const el = document.getElementById(`items-${index}`);
                      if (el) el.classList.toggle('hidden');
                    }}
                  >
                    {entry.subBatches.length}
                    {entry.subBatches.length > 1 ? 'Items' : 'Item'}
                    {entry.subBatches.length > 0 ? <ExpandCircleDownIcon /> : null}
                  </button>
                </td>
                <td className={styles.td}> {entry.batchPrice} </td>
                <td className={styles.td}>
                  <span className={styles.statusTag}> {entry.status} </span>
                </td>
                <td className={styles.td}> {entry.supplierName} </td>
                <td className={styles.td}> {formatDate(entry.entryDate)} </td>
              </tr>
              <tr id={`items-${index}`} className="hidden">
                <td colSpan={6} className={styles.td}>
                  <div className={styles.detailsWrapper}>
                    {entry.subBatches.map((subBatch) => (
                      <div
                        key={subBatch.subBatchId}
                        className={styles.subBatchItem}
                      >
                        <div> <strong>Item Name:</strong> {subBatch.itemName} </div>
                        <div> <strong>Quantity:</strong> {subBatch.quantity} </div>
                        <div> <strong>Per Crate Quantity:</strong> {subBatch.packSize} </div>
                        <div> <strong>Unit Price:</strong> ₹ {subBatch.recordUnitPrice.toFixed(2)} </div>
                        <div>
                          <strong>Discount:</strong>
                          {subBatch.discountType === "percentage"
                            ? `${subBatch.discount}%`
                            : `₹${subBatch.discount}`}
                        </div>
                        <div>
                          <strong>Manufacture Date:</strong>
                          {formatDate(subBatch.manufactureDate)}
                        </div>
                        <div>
                          <strong>Expiry Date:</strong>
                          {formatDate(subBatch.expiryDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
