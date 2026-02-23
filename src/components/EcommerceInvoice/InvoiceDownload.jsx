import jsPDF from "jspdf";
import styles from "./styles/InvoiceDownload.module.css";

export default function InvoiceDownload({ items, invoiceData, invoiceId }) {
  const handleDownloadPDF = () => {
    const { invoice, customer, organization, payment, order } = invoiceData || {};
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 15;

    // Header background
    doc.setFillColor(25, 45, 85);
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Company Logo / Title
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('INVOICE', 20, 25);

    // Invoice number on right
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`#${invoice?.invoice_number || invoiceId}`, pageWidth - 40, 22);

    yPosition = 45;

    // Company Info (Left side)
    doc.setFontSize(12);
    doc.setTextColor(25, 45, 85);
    doc.setFont(undefined, 'bold');
    doc.text(organization?.name || 'Company Name', 20, yPosition);
    
    yPosition += 8;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(80, 80, 80);
    
    const companyDetails = [
      `Email: ${organization?.email || 'N/A'}`,
      `Phone: ${organization?.phone || 'N/A'}`,
      `GSTIN: ${organization?.gstin || 'N/A'}`,
      `${organization?.address_line || ''}, ${organization?.city || ''}`,
      `${organization?.state || ''} ${organization?.pin_code || ''}`
    ];
    
    companyDetails.forEach(detail => {
      if (detail.trim()) {
        doc.text(detail, 20, yPosition);
        yPosition += 5;
      }
    });

    // Invoice details (Right side)
    yPosition = 45;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    
    const rightX = 130;
    const invoiceDetails = [
      { label: 'Invoice Date:', value: new Date(invoice?.invoice_date).toLocaleDateString('en-IN') },
      { label: 'Due Date:', value: invoice?.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : 'N/A' },
      { label: 'Order #:', value: order?.order_number || 'N/A' },
      { label: 'Order Date:', value: order?.order_date ? new Date(order.order_date).toLocaleDateString('en-IN') : 'N/A' }
    ];

    invoiceDetails.forEach(detail => {
      doc.setFont(undefined, 'bold');
      doc.text(detail.label, rightX, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(detail.value, rightX + 35, yPosition);
      yPosition += 6;
    });

    yPosition += 8;

    // Bill To section
    doc.setFontSize(10);
    doc.setTextColor(25, 45, 85);
    doc.setFont(undefined, 'bold');
    doc.text('BILL TO:', 20, yPosition);
    
    yPosition += 7;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(customer?.name || 'Customer Name', 20, yPosition);
    yPosition += 5;
    
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const customerDetails = [
      `Email: ${customer?.email || 'N/A'}`,
      `Phone: ${customer?.phone || 'N/A'}`,
      `GSTIN: ${customer?.gstin || 'N/A'}`,
      `Address: ${customer?.billing_address?.line1 || ''}, ${customer?.billing_address?.city || ''}`,
      `${customer?.billing_address?.state || ''} ${customer?.billing_address?.pin_code || ''}`
    ];
    
    customerDetails.forEach(detail => {
      if (detail.trim()) {
        doc.text(detail, 20, yPosition);
        yPosition += 4;
      }
    });

    yPosition += 5;

    // Table header
    doc.setFontSize(10);
    doc.setFillColor(25, 45, 85);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    
    const tableY = yPosition;
    doc.rect(20, tableY - 6, 170, 8, 'F');
    
    doc.text('Item Description', 22, tableY);
    doc.text('Qty', 80, tableY);
    doc.text('Unit Price', 100, tableY);
    doc.text('CGST%', 125, tableY);
    doc.text('SGST%', 145, tableY);
    doc.text('Amount', 165, tableY);

    yPosition += 10;

    // Table rows
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    
    items.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      
      // Page break if needed
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, yPosition - 4, 170, 6, 'F');
      }

      doc.text(item.name, 22, yPosition);
      doc.text(item.qty.toString(), 80, yPosition);
      doc.text(`Rs. ${item.price.toLocaleString()}`, 100, yPosition);
      doc.text(item.cgst ? `${item.cgst}%` : '-', 125, yPosition);
      doc.text(item.sgst ? `${item.sgst}%` : '-', 145, yPosition);
      doc.text(`Rs. ${itemTotal.toLocaleString()}`, 165, yPosition);

      yPosition += 7;
    });

    yPosition += 3;

    // Summary section
    doc.setDrawColor(25, 45, 85);
    doc.setLineWidth(0.5);
    doc.line(100, yPosition, 190, yPosition);

    yPosition += 6;

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = items.reduce((s, i) => s + (i.discount || 0), 0);
    const shipping = 0;
    const total = subtotal - discount + shipping;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    
    // Subtotal
    doc.text('Subtotal:', 135, yPosition);
    doc.text(`Rs. ${subtotal.toLocaleString()}`, 165, yPosition);
    yPosition += 6;

    // Discount
    if (discount > 0) {
      doc.setTextColor(198, 39, 40);
      doc.text(`Discount (-):`, 135, yPosition);
      doc.text(`Rs. ${discount.toLocaleString()}`, 165, yPosition);
      yPosition += 6;
      doc.setTextColor(80, 80, 80);
    }

    // Shipping
    doc.text('Shipping:', 135, yPosition);
    doc.text('FREE', 165, yPosition);
    yPosition += 8;

    // Total
    doc.setFillColor(25, 45, 85);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    
    doc.rect(100, yPosition - 5, 90, 8, 'F');
    doc.text('TOTAL AMOUNT:', 135, yPosition);
    doc.text(`Rs. ${total.toLocaleString()}`, 165, yPosition);

    yPosition += 12;

    // Payment section
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(25, 45, 85);
    doc.text('PAYMENT INFORMATION', 20, yPosition);
    
    yPosition += 6;
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    
    const paymentInfo = [
      { label: 'Payment Status:', value: payment?.payment_status?.toUpperCase() || 'PENDING' },
      { label: 'Payment Method:', value: payment?.payment_method || 'N/A' },
      { label: 'Payment Date:', value: payment?.payment_date ? new Date(payment.payment_date).toLocaleDateString('en-IN') : 'N/A' },
      { label: 'Transaction ID:', value: payment?.id || 'N/A' }
    ];

    paymentInfo.forEach(info => {
      doc.setFont(undefined, 'bold');
      doc.text(info.label, 20, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(info.value, 55, yPosition);
      yPosition += 5;
    });

    // Footer
    yPosition = pageHeight - 20;
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition += 5;
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont(undefined, 'italic');
    doc.text('Thank you for your business! This is a digitally generated invoice.', 20, yPosition);
    doc.text('For queries, please contact: ' + (organization?.email || 'support@company.com'), 20, yPosition + 4);

    // Download
    doc.save(`Invoice_${invoice?.invoice_number || invoiceId}.pdf`);
  };

  return (
    <button className={styles.downloadBadge} onClick={handleDownloadPDF}>
      ⬇ Download Invoice (PDF)
    </button>
  );
}
