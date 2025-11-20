import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert
} from '@mui/material';

const PartialAmountDialog = ({ open, onClose, onConfirm, fullAmount, paidAmount = 0, isRemainingPayment = false }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const remainingAmount = fullAmount - paidAmount;
  const maxAmount = isRemainingPayment ? remainingAmount : fullAmount;
  const minAmount = Math.min(1000, Math.floor(maxAmount * 0.1)); // Min 10% or ₹1000

  const handleConfirm = () => {
    setError('');
    const parsedAmount = parseInt(amount);

    if (!amount || isNaN(parsedAmount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (parsedAmount < minAmount) {
      setError(`Minimum amount is ₹${(minAmount / 100).toLocaleString('en-IN')}`);
      return;
    }

    if (parsedAmount >= maxAmount) {
      setError(`Amount must be less than ₹${(maxAmount / 100).toLocaleString('en-IN')}`);
      return;
    }

    onConfirm(parsedAmount);
    setAmount('');
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.2rem' }}>
        {isRemainingPayment ? 'Pay Remaining Amount' : 'Enter Partial Payment Amount'}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isRemainingPayment && (
            <Box
              sx={{
                p: 2,
                background: 'linear-gradient(135deg, rgba(30, 41, 56, 0.05), rgba(196, 32, 50, 0.05))',
                borderRadius: 1.5,
                border: '1px solid #e2e8f0'
              }}
            >
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Remaining Amount
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: 'primary.main',
                  mt: 0.5,
                  fontSize: '1.3rem'
                }}
              >
                ₹{(remainingAmount / 100).toLocaleString('en-IN')}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                background: '#f8fafc',
                borderRadius: 1,
                border: '1px solid #e2e8f0'
              }}
            >
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                {isRemainingPayment ? 'Min Payment' : 'Min Amount'}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.3 }}>
                ₹{(minAmount / 100).toLocaleString('en-IN')}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                background: '#f8fafc',
                borderRadius: 1,
                border: '1px solid #e2e8f0'
              }}
            >
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                {isRemainingPayment ? 'Max Payment' : 'Max Amount'}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.3 }}>
                ₹{((maxAmount - 1) / 100).toLocaleString('en-IN')}
              </Typography>
            </Box>
          </Box>

          <TextField
            autoFocus
            label={isRemainingPayment ? 'Remaining Amount to Pay' : 'Amount (in paise)'}
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ step: '100', min: minAmount, max: maxAmount - 1 }}
            placeholder="Enter amount in paise"
            variant="outlined"
            helperText="Enter amount in paise (e.g., 10000 for ₹100)"
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Box
            sx={{
              p: 1.5,
              background: '#f0f9ff',
              borderRadius: 1,
              border: '1px solid #bfdbfe'
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e40af' }}>
              💡 You can pay less than the full amount and complete the remaining payment later.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Proceed to Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PartialAmountDialog;
