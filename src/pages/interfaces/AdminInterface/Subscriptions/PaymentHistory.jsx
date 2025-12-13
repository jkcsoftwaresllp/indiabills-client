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
} from "@mui/material";
import { Info, Download, Receipt } from "@mui/icons-material";
import { getSubscriptionPayments } from "../../../../network/api/subscriptionApi";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSubscriptionPayments();

      if (response.status === 200 && response.data.success) {
        const data = response.data.data || [];
        // Sort by created_at in descending order (newest first)
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPayments(data);
      } else {
        setError(response.data.message || "Failed to load payment history");
      }
    } catch (err) {
      setError("Error fetching payment history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setDetailsDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return "success";
      case "failed":
        return "error";
      case "pending":
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
      hour: "2-digit",
      minute: "2-digit",
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

      {payments.length === 0 ? (
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
            No payment records found. Payments will appear here once you make a
            subscription payment.
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
                <TableCell>Payment ID</TableCell>
                <TableCell align="center">Order ID</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment, idx) => (
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
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                      }}
                    >
                      {payment.id || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#64748b",
                    }}
                  >
                    {payment.razorpay_order_id
                      ? payment.razorpay_order_id.substring(0, 8) + "..."
                      : "N/A"}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1.1rem",
                    }}
                  >
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={payment.status}
                      color={getStatusColor(payment.status)}
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
                    {formatDate(payment.created_at)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(payment)}
                      startIcon={<Receipt />}
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

      {/* Payment Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="sm"
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
          Payment Details
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          {selectedPayment && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
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
                  Payment ID
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    mt: 0.5,
                    color: "#1e293b",
                    fontFamily: "monospace",
                  }}
                >
                  {selectedPayment.id}
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
                  Razorpay Order ID
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    wordBreak: "break-all",
                    display: "block",
                    mt: 0.5,
                    fontSize: "0.8rem",
                    fontFamily: "monospace",
                  }}
                >
                  {selectedPayment.razorpay_order_id || "N/A"}
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
                  Razorpay Payment ID
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    wordBreak: "break-all",
                    display: "block",
                    mt: 0.5,
                    fontSize: "0.8rem",
                    fontFamily: "monospace",
                  }}
                >
                  {selectedPayment.razorpay_payment_id || "N/A"}
                </Typography>
              </Box>

              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
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
                    Amount
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
                    {formatCurrency(selectedPayment.amount)}
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
                    Status
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={selectedPayment.status}
                      color={getStatusColor(selectedPayment.status)}
                      variant="filled"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
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
                    sx={{ fontWeight: 700, mt: 0.5, color: "success.main" }}
                  >
                    {formatCurrency(selectedPayment.used_amount || 0)}
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
                    sx={{ fontWeight: 700, mt: 0.5, color: "#f59e0b" }}
                  >
                    {formatCurrency(selectedPayment.unused_amount || 0)}
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
                  Payment Date
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, mt: 0.5, color: "#1e293b" }}
                >
                  {formatDate(selectedPayment.created_at)}
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
                  Last Updated
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, mt: 0.5, color: "#1e293b" }}
                >
                  {formatDate(selectedPayment.updated_at)}
                </Typography>
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

export default PaymentHistory;
