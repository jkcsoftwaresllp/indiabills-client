import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

const PartialAmountDialog = ({
  open,
  onClose,
  onConfirm,
  fullAmount,
  paidAmount = 0,
  isRemainingPayment = false,
  remainingAmount: propsRemainingAmount = null,
  loading = false,
}) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // Amount is in rupees (not paise)
  const calculatedRemaining =
    isRemainingPayment && propsRemainingAmount
      ? propsRemainingAmount.remaining
      : fullAmount - paidAmount;
  const maxAmount = calculatedRemaining;
  const minAmount = Math.min(100, Math.floor(maxAmount * 0.1)); // Min 10% or ₹100

  const handleConfirm = () => {
    setError("");
    const parsedAmount = parseInt(amount);

    if (!amount || isNaN(parsedAmount)) {
      setError("Please enter a valid amount");
      return;
    }

    if (parsedAmount < minAmount) {
      setError(`Minimum amount is ₹${minAmount.toLocaleString("en-IN")}`);
      return;
    }

    if (parsedAmount >= maxAmount) {
      setError(
        `Amount must be less than ₹${maxAmount.toLocaleString("en-IN")}`
      );
      return;
    }

    onConfirm(parsedAmount);
    setAmount("");
  };

  const handleClose = () => {
    setAmount("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, fontSize: "1.2rem" }}>
        {isRemainingPayment
          ? "Pay Remaining Amount"
          : "Enter Partial Payment Amount"}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {isRemainingPayment && propsRemainingAmount && (
              <Box
                sx={{
                  p: 2,
                  background:
                    "linear-gradient(135deg, rgba(30, 41, 56, 0.05), rgba(196, 32, 50, 0.05))",
                  borderRadius: 1.5,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Total Amount
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        mt: 0.3,
                      }}
                    >
                      ₹
                      {propsRemainingAmount.total_amount?.toLocaleString(
                        "en-IN"
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Paid
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: "success.main",
                        mt: 0.3,
                      }}
                    >
                      ₹
                      {propsRemainingAmount.amount_paid?.toLocaleString(
                        "en-IN"
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Remaining
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 900,
                        color: "error.main",
                        mt: 0.3,
                      }}
                    >
                      ₹{propsRemainingAmount.remaining?.toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <Box
                sx={{
                  p: 1.5,
                  background: "#f8fafc",
                  borderRadius: 1,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontWeight: 600 }}
                >
                  {isRemainingPayment ? "Min Payment" : "Min Amount"}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.3 }}>
                  ₹{minAmount.toLocaleString("en-IN")}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  background: "#f8fafc",
                  borderRadius: 1,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontWeight: 600 }}
                >
                  {isRemainingPayment ? "Max Payment" : "Max Amount"}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.3 }}>
                  ₹{(maxAmount - 1).toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Box>

            <TextField
              autoFocus
              label={
                isRemainingPayment
                  ? "Remaining Amount to Pay"
                  : "Amount (in rupees)"
              }
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputProps={{ step: "1", min: minAmount, max: maxAmount - 1 }}
              placeholder="Enter amount in rupees"
              variant="outlined"
              helperText="Enter amount in rupees (e.g., 1000 for ₹1000)"
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Box
              sx={{
                p: 1.5,
                background: "#f0f9ff",
                borderRadius: 1,
                border: "1px solid #bfdbfe",
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "#1e40af" }}
              >
                💡 You can pay less than the full amount and complete the
                remaining payment later.
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{ textTransform: "none", fontWeight: 600 }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{ textTransform: "none", fontWeight: 600 }}
          disabled={loading}
        >
          Proceed to Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PartialAmountDialog;
