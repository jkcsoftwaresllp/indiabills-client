import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { verifySubscriptionPayment } from '../../../../network/api/subscriptionApi';

const PaymentModal = ({ open, onClose, paymentData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    if (open && paymentData) {
      loadRazorpayScript();
    }
  }, [open, paymentData]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!window.Razorpay) {
      setError('Razorpay script failed to load');
      return;
    }

    setPaymentProcessing(true);
    setError(null);

    const options = {
      key: paymentData.razorpay_key,
      amount: paymentData.amount,
      currency: paymentData.currency,
      order_id: paymentData.order_id,
      name: 'IndiaBills',
      description: `${paymentData.plan.name} - ${paymentData.plan.cycle}`,
      handler: async (response) => {
        try {
          setLoading(true);
          
          const verifyResponse = await verifySubscriptionPayment({
            planId: paymentData.planId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            cycle: paymentData.cycle
          });

          if (verifyResponse.status === 200 && verifyResponse.data.success) {
            setLoading(false);
            setPaymentProcessing(false);
            onSuccess();
            onClose();
          } else {
            setError(verifyResponse.data.message || 'Payment verification failed');
            setLoading(false);
            setPaymentProcessing(false);
          }
        } catch (err) {
          setError('Error verifying payment');
          console.error(err);
          setLoading(false);
          setPaymentProcessing(false);
        }
      },
      prefill: {
        email: sessionStorage.getItem('userEmail') || '',
        contact: sessionStorage.getItem('userPhone') || ''
      },
      theme: {
        color: '#3f51b5'
      },
      modal: {
        ondismiss: () => {
          setPaymentProcessing(false);
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setPaymentProcessing(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Complete Your Subscription</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Plan:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                {paymentData?.plan?.name}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                Amount:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                ₹{(paymentData?.amount / 100).toLocaleString()}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                Billing Cycle:
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {paymentData?.cycle === 'yearly' ? 'Yearly' : 'Monthly'}
              </Typography>

              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  You will be redirected to Razorpay's secure payment gateway to complete your subscription.
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading || paymentProcessing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePayment}
          disabled={loading || paymentProcessing}
        >
          {paymentProcessing ? 'Processing...' : 'Pay Now'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
