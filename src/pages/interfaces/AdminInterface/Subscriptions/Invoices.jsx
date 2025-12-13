import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Card,
} from "@mui/material";
import {
  Info,
  Visibility,
} from "@mui/icons-material";
import {
  getSubscriptionInvoices,
  getPaymentInvoices,
  getSubscriptionHistory,
  getSubscriptionPayments,
} from "../../../../network/api/subscriptionApi";
import ViewInvoice from "./ViewInvoice";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewInvoiceOpen, setViewInvoiceOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch subscription history and payments to build invoice list
      const historyResponse = await getSubscriptionHistory();
      const paymentsResponse = await getSubscriptionPayments();

      const invoiceList = [];

      // Add subscription invoices
      if (
        historyResponse.status === 200 &&
        historyResponse.data.success &&
        historyResponse.data.data
      ) {
        historyResponse.data.data.forEach((subscription) => {
          invoiceList.push({
            id: `SUB-${subscription.subscription_id}`,
            type: "subscription",
            invoice_number: `SUB-${subscription.subscription_id}`,
            plan_name: subscription.plan_name,
            total_amount: subscription.total_amount,
            amount_paid: subscription.amount_paid,
            status: subscription.subscription_status,
            created_at: subscription.start_date,
            data: subscription,
          });
        });
      }

      // Add payment invoices
      if (
        paymentsResponse.status === 200 &&
        paymentsResponse.data.success &&
        paymentsResponse.data.data
      ) {
        paymentsResponse.data.data.forEach((payment) => {
          invoiceList.push({
            id: `PAY-${payment.id}`,
            type: "payment",
            invoice_number: `PAY-${payment.id}`,
            plan_name: "Payment",
            total_amount: payment.amount,
            amount_paid: payment.amount,
            status: payment.status,
            created_at: payment.created_at,
            data: payment,
          });
        });
      }

      // Sort by created_at descending
      invoiceList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setInvoices(invoiceList);
    } catch (err) {
      setError("Error fetching invoices");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceType(invoice.type);
    setViewInvoiceOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "completed":
      case "success":
        return "success";
      case "expired":
      case "failed":
        return "error";
      case "pending":
      case "pending_payment":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 0 }}>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 1.25,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Info sx={{ fontSize: "1.1rem" }} />
          {error}
        </Alert>
      )}

      {invoices.length === 0 ? (
        <Card
          sx={{
            p: 2.5,
            textAlign: "center",
            borderRadius: 1.5,
            border: "2px dashed #cbd5e1",
            background: "var(--color-light)",
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ fontSize: "0.95rem" }}
          >
            No invoices found. Invoices will be generated once you complete a
            subscription or payment.
          </Typography>
        </Card>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 1.5,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e2e8f0",
            transition: "all 0.3s ease",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  "& .MuiTableCell-head": {
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.01em",
                    textTransform: "uppercase",
                    borderBottom: "none",
                    padding: "0.9rem 1rem",
                  },
                }}
              >
                <TableCell>Invoice #</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Plan/Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice, idx) => (
                <TableRow
                  key={idx}
                  hover
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(30, 41, 56, 0.04)",
                      boxShadow: "0 4px 12px rgba(196, 32, 50, 0.08)",
                    },
                    "& .MuiTableCell-root": {
                      padding: "0.8rem 1rem",
                      borderBottom: "1px solid #f0f0f0",
                      fontSize: "0.9rem",
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                      {invoice.invoice_number}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        invoice.type === "subscription"
                          ? "Subscription"
                          : "Payment"
                      }
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor:
                          invoice.type === "subscription"
                            ? "primary.main"
                            : "#f59e0b",
                        color:
                          invoice.type === "subscription"
                            ? "primary.main"
                            : "#f59e0b",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                    {invoice.plan_name}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    {formatCurrency(invoice.total_amount)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={invoice.status}
                      color={getStatusColor(invoice.status)}
                      size="small"
                      variant="filled"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        height: "22px",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "#64748b" }}>
                    {formatDate(invoice.created_at)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(invoice)}
                      startIcon={<Visibility />}
                      sx={{
                        borderColor: "primary.main",
                        color: "primary.main",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 0.75,
                        fontSize: "0.8rem",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "primary.main",
                          backgroundColor: "rgba(30, 41, 56, 0.08)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Invoice Modal */}
      <ViewInvoice
        open={viewInvoiceOpen}
        onClose={() => setViewInvoiceOpen(false)}
        invoice={selectedInvoice}
        type={invoiceType}
      />
    </Box>
  );
};

export default Invoices;
