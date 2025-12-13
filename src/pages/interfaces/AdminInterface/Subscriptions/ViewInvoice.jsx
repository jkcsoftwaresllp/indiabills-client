import { useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, CircularProgress, Alert } from "@mui/material";
import { Download, Close, Info } from "@mui/icons-material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./ViewInvoice.module.css";

const ViewInvoice = ({ open, onClose, invoice, type }) => {
  const invoiceRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const scales = ["", "Thousand", "Million", "Billion", "Trillion"];

    const convertBelowThousand = (number) => {
      if (number === 0) return "";
      else if (number < 10) return ones[number];
      else if (number < 100)
        return (
          tens[Math.floor(number / 10)] +
          (number % 10 !== 0 ? " " + ones[number % 10] : "")
        );
      else
        return (
          ones[Math.floor(number / 100)] +
          " Hundred" +
          (number % 100 !== 0 ? " " + convertBelowThousand(number % 100) : "")
        );
    };

    if (num === 0) return "Zero";

    let scaleIndex = 0;
    let result = "";

    while (num > 0) {
      if (num % 1000 !== 0) {
        result =
          convertBelowThousand(num % 1000) +
          (scales[scaleIndex] ? " " + scales[scaleIndex] : "") +
          (result ? " " + result : "");
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return result.trim();
  };

  const downloadInvoice = async () => {
    setLoading(true);
    try {
      const element = invoiceRef.current;

      // Create canvas from HTML
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF("p", "mm", "a4");

      let heightLeft = imgHeight;
      let position = 0;

      // Add image to PDF and handle pagination
      const imgData = canvas.toDataURL("image/png");

      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297; // A4 height in mm
        if (heightLeft > 0) {
          pdf.addPage();
          position = -297;
        }
      }

      // Save PDF
      const filename = `Invoice-${invoice?.invoice_number || "unknown"}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    if (
      statusLower === "completed" ||
      statusLower === "success" ||
      statusLower === "paid"
    ) {
      return styles.statusBadgePaid || styles.statusBadge + "-paid";
    } else if (statusLower === "partial") {
      return styles.statusBadgePartial || styles.statusBadge + "-partial";
    } else if (statusLower === "pending" || statusLower === "unpaid") {
      return styles.statusBadgeUnpaid || styles.statusBadge + "-unpaid";
    } else if (statusLower === "failed") {
      return styles.statusBadgeFailed || styles.statusBadge + "-failed";
    }
    return styles.statusBadge;
  };

  const renderSubscriptionInvoice = () => {
    const sub = invoice?.data;
    const totalAmount = invoice?.total_amount || 0;

    return (
      <div className={styles.invoiceContainer}>
        <div className={styles.invoiceContent} ref={invoiceRef}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.companyInfo}>
              <h1>IndiaBills</h1>
              <p>Subscription Management System</p>
              <p>support@indiabills.com</p>
              <p>+91 XXXXX XXXXX</p>
            </div>

            <div className={styles.invoiceTitle}>
              <h2>SUBSCRIPTION INVOICE</h2>
              <p>#{invoice?.invoice_number}</p>
            </div>

            <div className={styles.qrCode}>
              <span className={styles.qrLabel}>Invoice QR</span>
              <svg width="80" height="80" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
              </svg>
            </div>
          </div>

          {/* Meta Information */}
          <div className={styles.metaSection}>
            <div className={styles.metaGroup}>
              <h3>Invoice Details</h3>
              <p>
                <strong>Invoice #:</strong> {invoice?.invoice_number}
              </p>
              <p>
                <strong>Type:</strong> Subscription
              </p>
              <p>
                <strong>Date:</strong> {formatDate(invoice?.created_at)}
              </p>
              {invoice?.snapshot && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    marginTop: "8px",
                  }}
                >
                  <strong>Snapshot ID:</strong> {invoice.snapshot.id || "N/A"}
                </p>
              )}
            </div>

            <div className={styles.metaGroup}>
              <h3>Plan Information</h3>
              <p>
                <strong>Plan Name:</strong> {invoice?.plan_name}
              </p>
              <p>
                <strong>Cycle:</strong>{" "}
                {sub?.cycle
                  ? sub.cycle.charAt(0).toUpperCase() + sub.cycle.slice(1)
                  : "N/A"}
              </p>
              <p>
                <strong>Max Users:</strong> {sub?.max_users || "Unlimited"}
              </p>
            </div>

            <div className={styles.metaGroup}>
              <h3>Status</h3>
              <div
                className={`${styles.statusBadge} ${getStatusClass(
                  invoice?.status
                )}`}
                style={{
                  background:
                    invoice?.status?.toLowerCase() === "active" ||
                    invoice?.status?.toLowerCase() === "paid"
                      ? "rgba(34, 197, 94, 0.1)"
                      : "rgba(239, 68, 68, 0.1)",
                  color:
                    invoice?.status?.toLowerCase() === "active" ||
                    invoice?.status?.toLowerCase() === "paid"
                      ? "#16a34a"
                      : "#dc2626",
                  border:
                    invoice?.status?.toLowerCase() === "active" ||
                    invoice?.status?.toLowerCase() === "paid"
                      ? "1px solid #86efac"
                      : "1px solid #fecaca",
                }}
              >
                {invoice?.status}
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className={styles.billingSection}>
            <div className={styles.billingBlock}>
              <h4>Plan Details</h4>
              <p>
                <strong>Monthly Price:</strong>{" "}
                {formatCurrency(sub?.price_monthly || 0)}
              </p>
              <p>
                <strong>Yearly Price:</strong>{" "}
                {formatCurrency(sub?.price_yearly || 0)}
              </p>
              <p>
                <strong>Max Users:</strong> {sub?.max_users || "Unlimited"}
              </p>
            </div>

            <div className={styles.billingBlock}>
              <h4>Billing Period</h4>
              <p>
                <strong>From:</strong> {formatDate(sub?.start_date)}
              </p>
              <p>
                <strong>To:</strong> {formatDate(sub?.end_date)}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                {sub?.payment_status
                  ? sub.payment_status.charAt(0).toUpperCase() +
                    sub.payment_status.slice(1)
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className={styles.itemsSection}>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th className={styles.right}>Rate</th>
                  <th className={styles.right}>Quantity</th>
                  <th className={styles.right}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {invoice?.plan_name} Subscription ({sub?.cycle})
                  </td>
                  <td className={styles.right}>
                    {sub?.cycle === "yearly"
                      ? formatCurrency(sub?.price_yearly || totalAmount)
                      : formatCurrency(sub?.price_monthly || totalAmount)}
                  </td>
                  <td className={styles.right}>1</td>
                  <td className={`${styles.right} ${styles.amount}`}>
                    {formatCurrency(totalAmount)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">Subtotal</td>
                  <td className={styles.right}>
                    {formatCurrency(totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryLeft}>
              <p>
                <strong>Terms & Conditions:</strong>
              </p>
              <p>
                This invoice is valid for the subscription period mentioned
                above. Payment must be made by the due date to avoid service
                interruption.
              </p>
              <div className={styles.amountInWords}>
                <strong>Amount in Words:</strong>
              </div>
              <p>{numberToWords(Math.round(totalAmount))} Indian Rupees Only</p>
              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    margin: "4px 0",
                  }}
                >
                  <strong>Amount Paid:</strong>{" "}
                  {formatCurrency(invoice?.amount_paid || 0)}
                </p>
                {sub?.total_used_amount && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      margin: "4px 0",
                    }}
                  >
                    <strong>Total Used:</strong>{" "}
                    {formatCurrency(sub.total_used_amount)}
                  </p>
                )}
                {sub?.balance_amount !== undefined && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      margin: "4px 0",
                    }}
                  >
                    <strong>Balance:</strong>{" "}
                    {formatCurrency(sub.balance_amount)}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.summaryRight}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Tax (0%)</span>
                <span className={styles.summaryValue}>₹0.00</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Discount</span>
                <span className={styles.summaryValue}>₹0.00</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Amount Paid</span>
                <span className={styles.summaryValue}>
                  {formatCurrency(invoice?.amount_paid || 0)}
                </span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total Amount</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerText}>
              <p>
                <strong>Payment Details:</strong>
              </p>
              <p>Account Number: XXXXXXXXXXXX</p>
              <p>IFSC Code: XXXXXXXX</p>
              <p style={{ fontSize: "11px", marginTop: "12px" }}>
                This is a computer-generated invoice and does not require a
                signature.
              </p>
              {invoice?.snapshot && (
                <div
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <p style={{ margin: "4px 0" }}>
                    <strong>Snapshot Data:</strong>
                  </p>
                  <p style={{ margin: "2px 0" }}>
                    Created: {formatDate(invoice?.created_at)}
                  </p>
                  <p style={{ margin: "2px 0", wordBreak: "break-all" }}>
                    Snapshot Hash:{" "}
                    {typeof invoice.snapshot === "string"
                      ? invoice.snapshot.substring(0, 40)
                      : JSON.stringify(invoice.snapshot).substring(0, 40)}
                    ...
                  </p>
                </div>
              )}
            </div>
            <div className={styles.footerSignature}>
              <div className={styles.signatureLabel}>Authorized By</div>
              <div className={styles.signatureLine}></div>
              <p style={{ fontSize: "12px", margin: "8px 0" }}>
                IndiaBills Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentInvoice = () => {
    const payment = invoice?.data;
    const totalAmount = invoice?.total_amount || invoice?.amount_paid || 0;

    return (
      <div className={styles.invoiceContainer}>
        <div className={styles.invoiceContent} ref={invoiceRef}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.companyInfo}>
              <h1>IndiaBills</h1>
              <p>Subscription Management System</p>
              <p>support@indiabills.com</p>
              <p>+91 XXXXX XXXXX</p>
            </div>

            <div className={styles.invoiceTitle}>
              <h2>PAYMENT INVOICE</h2>
              <p>#{invoice?.invoice_number}</p>
            </div>

            <div className={styles.qrCode}>
              <span className={styles.qrLabel}>Invoice QR</span>
              <svg width="80" height="80" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
              </svg>
            </div>
          </div>

          {/* Meta Information */}
          <div className={styles.metaSection}>
            <div className={styles.metaGroup}>
              <h3>Invoice Details</h3>
              <p>
                <strong>Invoice #:</strong> {invoice?.invoice_number}
              </p>
              <p>
                <strong>Type:</strong> Payment
              </p>
              <p>
                <strong>Date:</strong> {formatDate(invoice?.created_at)}
              </p>
            </div>

            <div className={styles.metaGroup}>
              <h3>Payment Information</h3>
              <p>
                <strong>Payment ID:</strong>{" "}
                {payment?.id ? `PAY-${payment.id}` : "N/A"}
              </p>
              <p>
                <strong>Razorpay ID:</strong>{" "}
                {payment?.razorpay_payment_id || "N/A"}
              </p>
              {payment?.razorpay_order_id && (
                <p>
                  <strong>Order ID:</strong> {payment.razorpay_order_id}
                </p>
              )}
              {payment?.subscription_id && (
                <p>
                  <strong>Subscription:</strong> SUB-{payment.subscription_id}
                </p>
              )}
              {payment?.razorpay_signature && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    marginTop: "8px",
                  }}
                >
                  <strong>Signature:</strong>{" "}
                  {payment.razorpay_signature.substring(0, 20)}...
                </p>
              )}
              {invoice?.snapshot && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  <strong>Snapshot ID:</strong> {invoice.snapshot.id || "N/A"}
                </p>
              )}
            </div>

            <div className={styles.metaGroup}>
              <h3>Status</h3>
              <div
                className={`${styles.statusBadge} ${getStatusClass(
                  invoice?.status
                )}`}
                style={{
                  background:
                    invoice?.status?.toLowerCase() === "completed" ||
                    invoice?.status?.toLowerCase() === "success"
                      ? "rgba(34, 197, 94, 0.1)"
                      : "rgba(239, 68, 68, 0.1)",
                  color:
                    invoice?.status?.toLowerCase() === "completed" ||
                    invoice?.status?.toLowerCase() === "success"
                      ? "#16a34a"
                      : "#dc2626",
                  border:
                    invoice?.status?.toLowerCase() === "completed" ||
                    invoice?.status?.toLowerCase() === "success"
                      ? "1px solid #86efac"
                      : "1px solid #fecaca",
                }}
              >
                {invoice?.status}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className={styles.billingSection}>
            <div className={styles.billingBlock}>
              <h4>Amount Breakdown</h4>
              <p>
                <strong>Amount Paid:</strong> {formatCurrency(totalAmount)}
              </p>
              <p>
                <strong>Used Amount:</strong>{" "}
                {formatCurrency(payment?.used_amount || 0)}
              </p>
              <p>
                <strong>Unused Amount:</strong>{" "}
                {formatCurrency(payment?.unused_amount || 0)}
              </p>
            </div>

            <div className={styles.billingBlock}>
              <h4>Organization</h4>
              <p>
                <strong>Organization Name:</strong> Your Organization
              </p>
              <p>
                <strong>Email:</strong> organization@email.com
              </p>
              <p>
                <strong>GST No.:</strong> XXXXXXXXXXXX
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className={styles.itemsSection}>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th className={styles.right}>Amount</th>
                  <th className={styles.right}>Used</th>
                  <th className={styles.right}>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Subscription Payment</td>
                  <td className={styles.right}>
                    {formatCurrency(totalAmount)}
                  </td>
                  <td className={styles.right}>
                    {formatCurrency(payment?.used_amount || 0)}
                  </td>
                  <td className={`${styles.right} ${styles.amount}`}>
                    {formatCurrency(payment?.unused_amount || 0)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">Total</td>
                  <td className={styles.right}>
                    {formatCurrency(totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryLeft}>
              <p>
                <strong>Payment Terms:</strong>
              </p>
              <p>
                Payment received and processed successfully. The balance amount
                in your account can be used for future invoices.
              </p>
              <div className={styles.amountInWords}>
                <strong>Amount in Words:</strong>
              </div>
              <p>{numberToWords(Math.round(totalAmount))} Indian Rupees Only</p>
            </div>

            <div className={styles.summaryRight}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Amount Paid</span>
                <span className={styles.summaryValue}>
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Amount Used</span>
                <span className={styles.summaryValue}>
                  {formatCurrency(payment?.used_amount || 0)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Balance</span>
                <span className={styles.summaryValue}>
                  {formatCurrency(payment?.unused_amount || 0)}
                </span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total Amount</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerText}>
              <p>
                <strong>Payment Details:</strong>
              </p>
              <p>Account Number: XXXXXXXXXXXX</p>
              <p>IFSC Code: XXXXXXXX</p>
              <p style={{ fontSize: "11px", marginTop: "12px" }}>
                This is a computer-generated invoice and does not require a
                signature.
              </p>
              {payment?.razorpay_signature && (
                <div
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <p style={{ margin: "4px 0" }}>
                    <strong>Payment Signature Verification:</strong>
                  </p>
                  <p style={{ margin: "2px 0" }}>Status: Verified ✓</p>
                  <p style={{ margin: "2px 0", wordBreak: "break-all" }}>
                    Signature: {payment.razorpay_signature.substring(0, 40)}...
                  </p>
                </div>
              )}
              {invoice?.snapshot && (
                <div
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <p style={{ margin: "4px 0" }}>
                    <strong>Snapshot Data:</strong>
                  </p>
                  <p style={{ margin: "2px 0" }}>
                    Created: {formatDate(invoice?.created_at)}
                  </p>
                  <p style={{ margin: "2px 0", wordBreak: "break-all" }}>
                    Snapshot ID:{" "}
                    {typeof invoice.snapshot === "string"
                      ? invoice.snapshot.substring(0, 40)
                      : JSON.stringify(invoice.snapshot).substring(0, 40)}
                    ...
                  </p>
                </div>
              )}
            </div>
            <div className={styles.footerSignature}>
              <div className={styles.signatureLabel}>Authorized By</div>
              <div className={styles.signatureLine}></div>
              <p style={{ fontSize: "12px", margin: "8px 0" }}>
                IndiaBills Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: "#f8fafc",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2.5,
          background: "linear-gradient(90deg, #1e293b, #334155)",
          color: "white",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          View Invoice
        </h2>
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            minWidth: "auto",
            padding: 1,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Close />
        </Button>
      </Box>

      <Box sx={{ p: 3, maxHeight: "80vh", overflowY: "auto" }}>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && !invoice && (
          <Alert severity="error" icon={<Info />}>
            Invoice data not available. Please try again.
          </Alert>
        )}

        {!loading && invoice && (
          <>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={downloadInvoice}
                sx={{
                  background: "linear-gradient(90deg, #1e293b, #334155)",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 1,
                  padding: "10px 20px",
                  "&:hover": {
                    background: "linear-gradient(90deg, #0f172a, #1e293b)",
                  },
                }}
              >
                Download PDF
              </Button>
            </Box>

            {type === "subscription"
              ? renderSubscriptionInvoice()
              : renderPaymentInvoice()}
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default ViewInvoice;
