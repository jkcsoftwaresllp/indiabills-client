import React from "react";
import { getBaseURL } from "../../../network/api/api-config";
import styles from './styles/ShortInvoiceTemplate.module.css';

const ShortInvoiceTemplate = ({ invoice, Organization }) => {
  // Calculate totals
  const subtotal = invoice.items.reduce(
    (acc, item) => acc + parseFloat(item.unitPrice) * item.quantity,
    0
  );
  const tax = subtotal * 0.18; // Assuming 18% tax
  const shippingCost = 50; // Assuming flat shipping cost
  const discount = subtotal * 0.1; // Assuming 10% discount
  const totalAmount = subtotal + tax + shippingCost - discount;

 
return (
  <div className={styles.container}>
    <div id="invoice" className={styles.invoice}>
      <div className={styles.headerGrid}>
        <div className={styles.logoWrapper}>
          <img
            src={`${getBaseURL()}/${Organization.logo}`}
            alt={`${Organization.organizationName} logo`}
            className={styles.logo}
          />
        </div>
        <div className={styles.headerInfo}>
          <h4 className={styles.invoiceTitle}>Invoice</h4>
          <h2 className={styles.organizationName}>
            {Organization.organizationName || "Blab"}
          </h2>
          <div className={styles.invoiceDetails}>
            <p>Order ID: #{invoice.orderId}</p>
            <p>Invoice Number: {invoice.invoiceNumber}</p>
            <p>Invoice Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
            <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p>Payment Status: {invoice.paymentStatus}</p>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Item ID</th>
              <th className={styles.th}>Item Name</th>
              <th className={styles.th}>Quantity</th>
              <th className={styles.th}>Unit Price</th>
              <th className={styles.th}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.itemId}>
                <td className={styles.td}>{item.itemId}</td>
                <td className={styles.td}>{item.itemName}</td>
                <td className={styles.td}>{item.quantity}</td>
                <td className={styles.td}>₹{parseFloat(item.unitPrice).toFixed(2)}</td>
                <td className={styles.td}>₹{(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryBoxBorder}>
          <div className={styles.summaryRow}>
            <p className={styles.summaryLabel}>Subtotal:</p>
            <p className={styles.summaryValue}>₹{subtotal.toFixed(2)}</p>
          </div>
          <div className={styles.summaryRow}>
            <p className={styles.summaryLabel}>Tax (18%):</p>
            <p className={styles.summaryValue}>₹{tax.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.summaryBox}>
          <div className={styles.summaryRow}>
            <p className={styles.summaryLabel}>Shipping Cost:</p>
            <p className={styles.summaryValue}>₹{shippingCost.toFixed(2)}</p>
          </div>
          <div className={styles.summaryRow}>
            <p className={styles.summaryLabel}>Discount Applied:</p>
            <p className={styles.summaryValue}>₹{discount.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.totalAmountBox}>
          <h6 className={styles.totalAmountTitle}>
            Total Amount: <span className={styles.totalAmountValue}>₹{totalAmount.toFixed(2)}</span>
          </h6>
        </div>
      </div>
    </div>
  </div>
);

};

export default ShortInvoiceTemplate;
