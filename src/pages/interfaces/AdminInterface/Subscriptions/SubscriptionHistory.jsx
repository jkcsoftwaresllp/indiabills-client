import { useState, useEffect } from "react";
import {
  Container,
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
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
} from "@mui/material";
import { Info, Download } from "@mui/icons-material";
import { getSubscriptionHistory } from "../../../../network/api/subscriptionApi";

const SubscriptionHistory = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSubscriptionHistory();

      if (response.status === 200 && response.data.success) {
        setSubscriptions(response.data.data || []);
      } else {
        setError(
          response.data.message || "Failed to load subscription history"
        );
      }
    } catch (err) {
      setError("Error fetching subscription history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setDetailsDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "expired":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
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
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 0.3,
            letterSpacing: "-0.02em",
            fontSize: "1.35rem",
          }}
        >
          {/* Subscription History */}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontWeight: 400, fontSize: "0.9rem" }}
        >
          {/* View and manage all your subscription and payment records */}
        </Typography>
      </Box>

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

      {subscriptions.length === 0 ? (
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
            No subscriptions found yet. Start by purchasing a plan to see your
            subscription history here.
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
                <TableCell>Plan</TableCell>
                <TableCell align="center">Billing Cycle</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Payment</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions.map((subscription, idx) => (
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
                    {subscription.plan_name}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {subscription.cycle
                      ? subscription.cycle.charAt(0).toUpperCase() +
                        subscription.cycle.slice(1)
                      : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={subscription.subscription_status}
                      color={getStatusColor(subscription.subscription_status)}
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
                    {formatDate(subscription.start_date)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "#64748b" }}>
                    {formatDate(subscription.end_date)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1.1rem",
                    }}
                  >
                    ₹{subscription.amount_paid.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={subscription.payment_status}
                      color={getPaymentStatusColor(subscription.payment_status)}
                      size="small"
                      variant="filled"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        height: "22px",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(subscription)}
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

      {/* Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1.75,
            backgroundImage:
              "linear-gradient(135deg, #f9fafb 0%, #f1f5f9 100%)",
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
          Subscription Details
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          {selectedSubscription && (
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
                  Plan Name
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
                  {selectedSubscription.plan_name}
                </Typography>
              </Box>

              {selectedSubscription.features &&
                selectedSubscription.features.length > 0 && (
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
                      Plan Features
                    </Typography>
                    <Box
                      sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
                      {selectedSubscription.features.map((feature, idx) => (
                        <Chip
                          key={idx}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "primary.main",
                            color: "primary.main",
                            fontWeight: 600,
                            backgroundColor: "rgba(30, 41, 56, 0.06)",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

              <Box
                sx={{
                  p: 2,
                  background:
                    "linear-gradient(135deg, rgba(30, 41, 56, 0.05), rgba(196, 32, 50, 0.05))",
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
                  Billing Period
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {formatDate(selectedSubscription.start_date)} to{" "}
                  {formatDate(selectedSubscription.end_date)}
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
                    Status
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={selectedSubscription.subscription_status}
                      color={getStatusColor(
                        selectedSubscription.subscription_status
                      )}
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
                    Payment
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={selectedSubscription.payment_status}
                      color={getPaymentStatusColor(
                        selectedSubscription.payment_status
                      )}
                      variant="filled"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                </Box>
              </Box>

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
                  Amount Paid
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
                  ₹{selectedSubscription.amount_paid.toLocaleString()}
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
                  Payment Date
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, mt: 0.5, color: "#1e293b" }}
                >
                  {formatDate(selectedSubscription.payment_date)}
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
                  Max Users
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, mt: 0.5, color: "#1e293b" }}
                >
                  {selectedSubscription.max_users || "Unlimited"}
                </Typography>
              </Box>

              {selectedSubscription.razorpay_payment_id && (
                <Box
                  sx={{
                    p: 2,
                    background: "#f5f5f5",
                    borderRadius: 1.5,
                    border: "1px solid #e0e0e0",
                    fontFamily: "monospace",
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
                    variant="caption"
                    sx={{
                      wordBreak: "break-all",
                      display: "block",
                      mt: 0.5,
                      fontSize: "0.8rem",
                    }}
                  >
                    {selectedSubscription.razorpay_payment_id}
                  </Typography>
                </Box>
              )}

              {selectedSubscription.razorpay_order_id && (
                <Box
                  sx={{
                    p: 2,
                    background: "#f5f5f5",
                    borderRadius: 1.5,
                    border: "1px solid #e0e0e0",
                    fontFamily: "monospace",
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
                    Order ID
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      wordBreak: "break-all",
                      display: "block",
                      mt: 0.5,
                      fontSize: "0.8rem",
                    }}
                  >
                    {selectedSubscription.razorpay_order_id}
                  </Typography>
                </Box>
              )}
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

export default SubscriptionHistory;
