import React from "react";
import QRCode from 'react-qr-code';
import numberToWords from 'number-to-words';
import { formatDateDDMMYYYY } from "../../../utils/FormHelper";
import styles from './styles/ComprehensiveReportTemplate.module.css';

const ComprehensiveReportTemplate = ({ invoice, organization, initials }) => {
  const upiUrl = `upi://pay?pa=${organization.upi}&pn=${encodeURIComponent(organization.organizationName)}&cu=INR`;

  const formatPercent = (no) => {
    const num = Number(no);
    return Number.isInteger(num) ? Math.trunc(num) : num.toFixed(2);
  };
  
  const formatNumber = (num) => {
    return Number(num).toFixed(2);
  };

  const processedItems = invoice.items.map((item, index) => {
    const unitPrice = parseFloat(item.purchasePrice);
    const salePrice = parseFloat(item.salePrice);
    const quantity = item.quantity;
    const cess = parseFloat(item.cess);
    const cgst = parseFloat(item.cgst);
    const sgst = parseFloat(item.sgst);
    const totalTaxPercentage = cess + cgst + sgst;
    const total = parseFloat((salePrice * quantity).toFixed(3));
    const taxAmount = parseFloat(((total * totalTaxPercentage) / 100).toFixed(3));
    const rate = salePrice ? parseFloat(((total - taxAmount) / quantity).toFixed(3)) : 0;

    return {
      ...item,
      rate,
      total,
      taxAmount,
      totalTaxPercentage,
    };
  });

  const subtotal = parseFloat(
    processedItems
      .reduce((acc, item) => acc + item.rate * item.quantity, 0)
      .toFixed(3)
  );

  const totalItemDiscount = parseFloat(
    processedItems
      .reduce((acc, item) => acc + parseFloat(item.discount) * item.quantity, 0)
      .toFixed(3)
  );

  const orderDiscount = parseFloat((Number(invoice.discountOnOrder) || 0).toFixed(3) || '0.000');

  const discountApplied = parseFloat((totalItemDiscount + orderDiscount).toFixed(3));

  const taxAmount = parseFloat(
    processedItems
      .reduce((acc, item) => acc + item.taxAmount, 0)
      .toFixed(3)
  );

  const totalAmount = parseFloat(
    (subtotal - discountApplied + taxAmount).toFixed(3)
  );

  const roundedOffAmount = Math.round(Number(totalAmount));
  const amountInWords = numberToWords.toWords(roundedOffAmount);

  const totals = {
    rate: parseFloat(
      processedItems
        .reduce((acc, item) => acc + item.rate, 0)
        .toFixed(3)
    ),
    tax: parseFloat(
      processedItems
        .reduce((acc, item) => acc + item.totalTaxPercentage, 0)
        .toFixed(3)
    ),
    netTotal: parseFloat(
      processedItems
        .reduce((acc, item) => acc + item.total, 0)
        .toFixed(3)
    ),
  };

  const shippingCost = parseFloat(invoice.shippingCost);

 return (
  <div id="invoice-container" className={styles.invoiceContainer}>
    <div id="invoice-content" className={styles.invoiceContent}>

      <section id="upper-row" className={styles.upperRow}>

        <div id="contact" className={styles.contact}>
          <p><b>GSTIN:</b> {organization.gstin}</p>
          <p><b>UPI:</b> {organization.upi}</p>
          <p><b>Phone:</b> {organization.phone}</p>
        </div>

        <div className={styles.titleSection}>
          <h1 className={styles.taxInvoice}>Tax Invoice</h1>
          <h2 className={styles.organizationName}>{organization.organizationName}</h2>
          <span className={styles.addressWrapper}>
            <p className={styles.address}>{organization.addressLine}</p>
          </span>
        </div>

        {organization.upi && (
          <div id="qr-sec">
            <QRCode value={upiUrl} size={80} />
          </div>
        )}

      </section>

      <div className={styles.customerInvoiceSection}>
        <div className={styles.customerDetails}>
          <p><strong>Customer Name:</strong> {invoice.customerName}</p>
          {(invoice.gstin ? invoice.gstin !== `0` : false) && <p><strong>GSTIN:</strong> {invoice.gstin}</p>}
          <p className={styles.capitalize}><strong>Address:</strong> {invoice.shippingAddress}</p>
          <p><strong>Mobile:</strong> {invoice.mobile}</p>
        </div>
        <div className={styles.invoiceDetails}>
          <p><strong>Invoice Number:</strong> {`${initials}-${invoice.invoiceNumber}`}</p>
          <p><strong>Invoice Date:</strong> {formatDateDDMMYYYY(new Date(invoice.invoiceDate))}</p>
          <p className={styles.capitalize}><strong>Payment Method:</strong> {invoice.paymentMethod === 'upi' ? 'UPI' : invoice.paymentMethod} </p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.invoiceTable}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.thSmallCenter}>S.No</th>
              <th className={styles.thLargeLeft}>Item</th>
              <th className={styles.thMediumCenter}>HSN</th>
              <th className={styles.thSmallCenter}>MRP</th>
              <th className={styles.thSmallCenter}>QTY</th>
              <th className={styles.thMediumCenter}>Rate</th>
              <th className={styles.thMediumCenter}>
                GST<span className={styles.gstSpan}> (cgst+sgst+cess)</span>
              </th>
              <th className={styles.thSmallCenter}>DIS</th>
              <th className={styles.thSmallCenter}>Net</th>
            </tr>
          </thead>
          <tbody>
            {processedItems.map((item, index) => {
              const tax = `${formatPercent(item.totalTaxPercentage)}% (${formatPercent(item.cgst)}+${formatPercent(item.sgst)}+${formatPercent(item.cess)})`;
              return (
                <tr key={index} className={styles.tableRowHover}>
                  <td className={styles.tdCenter}>{index + 1}</td>
                  <td className={styles.tdLeftCap}>{item.itemName}</td>
                  <td className={styles.tdCenter}>{item.hsn || '-'}</td>
                  <td className={styles.tdCenter}>{item.unitMRP || '-'}</td>
                  <td className={styles.tdCenter}>{item.quantity}</td>
                  <td className={styles.tdCenter}>{formatNumber(item.rate)}</td>
                  <td className={styles.tdCenter}>{tax}</td>
                  <td className={styles.tdCenter}>{Number(item.discount).toFixed(2)}</td>
                  <td className={styles.tdCenter}>{formatNumber(item.total)}</td>
                </tr>
              );
            })}
            <tr className={styles.totalRow}>
              <td className={styles.tdCenterBold} colSpan={5}>Total</td>
              <td className={styles.tdCenterBold}>₹{formatNumber(totals.rate)}</td>
              <td className={styles.tdCenterBold}>₹{formatNumber(taxAmount)}</td>
              <td className={styles.tdCenterBold}></td>
              <td className={styles.tdCenterBold}>₹{formatNumber(totals.netTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <section className={styles.paymentSection}>
        <div className={styles.accountDetails}>
          <p><strong>Account Number:</strong> {organization.accountNumber}</p>
          <p><strong>IFSC Code:</strong> {organization.ifscCode}</p>
          <p className={styles.capitalize}><strong>Bank Branch:</strong> {organization.bankBranch}</p>
          <p className={styles.capitalize}><strong>Amount in Words:</strong> {amountInWords}</p>
          <p><strong>Declaration:</strong> {invoice.declaration || "Thank you for your purchase!"}</p>
        </div>
        <div className={styles.paymentSummary}>
          <div className={styles.flexBetween}>
            <p className={styles.textSlate}>Subtotal:</p>
            <p className={styles.textSlate}>₹{formatNumber(subtotal)}</p>
          </div>
          <div className={styles.flexBetween}>
            <p className={styles.textSlate}>Discount Applied:</p>
            <p className={styles.textSlate}>₹{formatNumber(discountApplied)}</p>
          </div>
          <div className={styles.flexBetween}>
            <p className={styles.textSlate}>Total Tax:</p>
            <p className={styles.textSlate}>₹{formatNumber(taxAmount)}</p>
          </div>
          {shippingCost > 0 && (
            <div className={styles.flexBetween}>
              <p className={styles.textSlate}>Shipping Cost:</p>
              <p className={styles.textSlate}>₹{formatNumber(shippingCost)}</p>
            </div>
          )}
          <div className={styles.flexBetweenBold}>
            <p>Total Amount:</p>
            <p>₹{formatNumber(totalAmount)}</p>
          </div>
          <div className={styles.flexBetween}>
            <p className={styles.textSlate}>Rounded Off (Gross):</p>
            <p className={styles.textSlate}>₹{formatNumber(roundedOffAmount)}</p>
          </div>
        </div>
      </section>

      <div className={styles.footerSection}>
        <div>
          <p className={styles.textSlate}>This is a computer-generated invoice.</p>
        </div>
        <div className={styles.signatureSection}>
          {invoice.authorizedSignature && (
            <img
              src={invoice.authorizedSignature}
              alt="Authorized Signature"
              className={styles.signatureImage}
            />
          )}
          <p className={styles.signatureText}>Authorized Signature</p>
        </div>
      </div>

    </div>
  </div>
);
};

export default ComprehensiveReportTemplate;