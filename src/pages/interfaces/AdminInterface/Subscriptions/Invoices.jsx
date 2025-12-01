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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  Grid,
} from "@mui/material";
import {
  Info,
  Download,
  Visibility,
} from "@mui/icons-material";
import {
  getSubscriptionInvoices,
  getPaymentInvoices,
  getSubscriptionHistory,
  getSubscriptionPayments,
} from "../../../../network/api/subscriptionApi";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

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
    setDetailsDialog(true);
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

      {/* Invoice Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1.75,
            backgroundImage: "linear-gradient(135deg, #f9fafb 0%, #f1f5f9 100%)",
            backgroundColor: "var(--color-light)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background:
              "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
            color: "white",
            fontWeight: 800,
            fontSize: "1.2rem",
            letterSpacing: "-0.01em",
            py: 1.5,
          }}
        >
          Invoice Details - {selectedInvoice?.invoice_number}
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          {selectedInvoice && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {/* Invoice Header */}
              <Box
                sx={{
                  p: 2,
                  background:
                    "linear-gradient(135deg, rgba(30, 41, 56, 0.08), rgba(196, 32, 50, 0.08))",
                  borderRadius: 1.5,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Invoice Number
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mt: 0.5,
                        color: "primary.main",
                      }}
                    >
                      {selectedInvoice.invoice_number}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Invoice Type
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        mt: 0.5,
                        color: "#1e293b",
                      }}
                    >
                      {selectedInvoice.type === "subscription"
                        ? "Subscription Invoice"
                        : "Payment Invoice"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Main Details */}
              <Box
                sx={{
                  p: 2,
                  background: "white",
                  borderRadius: 1.5,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {selectedInvoice.type === "subscription"
                    ? "Plan Name"
                    : "Description"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: "primary.main",
                    mt: 0.5,
                  }}
                >
                  {selectedInvoice.plan_name}
                </Typography>
              </Box>

              {/* Subscription-specific details */}
              {selectedInvoice.type === "subscription" &&
                selectedInvoice.data && (
                  <>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          background: "white",
                          borderRadius: 1.5,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          Billing Cycle
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            mt: 0.5,
                            color: "#1e293b",
                          }}
                        >
                          {selectedInvoice.data.cycle
                            ? selectedInvoice.data.cycle.charAt(0).toUpperCase() +
                              selectedInvoice.data.cycle.slice(1)
                            : "N/A"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          background: "white",
                          borderRadius: 1.5,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          Period
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            mt: 0.5,
                            color: "#1e293b",
                          }}
                        >
                          {formatDate(selectedInvoice.data.start_date)} to{" "}
                          {formatDate(selectedInvoice.data.end_date)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        background: "white",
                        borderRadius: 1.5,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Max Users
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mt: 0.5,
                          color: "#1e293b",
                        }}
                      >
                        {selectedInvoice.data.max_users || "Unlimited"}
                      </Typography>
                    </Box>
                  </>
                )}

              {/* Payment-specific details */}
              {selectedInvoice.type === "payment" &&
                selectedInvoice.data && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        background: "white",
                        borderRadius: 1.5,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Used Amount
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          mt: 0.5,
                          color: "success.main",
                        }}
                      >
                        {formatCurrency(
                          selectedInvoice.data.used_amount || 0
                        )}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        background: "white",
                        borderRadius: 1.5,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Unused Amount
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          mt: 0.5,
                          color: "#f59e0b",
                        }}
                      >
                        {formatCurrency(
                          selectedInvoice.data.unused_amount || 0
                        )}
                      </Typography>
                    </Box>
                  </Box>
                )}

              {/* Amount Details */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    background:
                      "linear-gradient(135deg, rgba(30, 41, 56, 0.08), rgba(196, 32, 50, 0.08))",
                    borderRadius: 1.5,
                    border: "2px solid primary.main",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      color: "primary.main",
                      mt: 0.5,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {formatCurrency(selectedInvoice.total_amount)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    background:
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(22, 163, 74, 0.08))",
                    borderRadius: 1.5,
                    border: "2px solid #22c55e",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Amount Paid
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      color: "success.main",
                      mt: 0.5,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {formatCurrency(selectedInvoice.amount_paid)}
                  </Typography>
                </Box>
              </Box>

              {/* Status and Date */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    background: "white",
                    borderRadius: 1.5,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Status
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={selectedInvoice.status}
                      color={getStatusColor(selectedInvoice.status)}
                      variant="filled"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    background: "white",
                    borderRadius: 1.5,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Date
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, mt: 0.5, color: "#1e293b" }}
                  >
                    {formatDate(selectedInvoice.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 1.5, gap: 1 }}>
          <Button
            onClick={() => setDetailsDialog(false)}
            sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.9rem" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices;
