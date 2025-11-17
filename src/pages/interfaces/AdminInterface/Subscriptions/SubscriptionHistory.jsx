import { useState, useEffect } from 'react';
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
  DialogContent
} from '@mui/material';
import { getSubscriptionHistory } from '../../../../network/api/subscriptionApi';

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
        setError(response.data.message || 'Failed to load subscription history');
      }
    } catch (err) {
      setError('Error fetching subscription history');
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
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Subscription History
        </Typography>
        <Typography variant="body1" color="textSecondary">
          View all your subscription and payment records
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {subscriptions.length === 0 ? (
        <Alert severity="info">No subscriptions found. Start by purchasing a plan.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Cycle</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Payment Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions.map((subscription, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{subscription.plan_name}</TableCell>
                  <TableCell>
                    {subscription.cycle ? subscription.cycle.charAt(0).toUpperCase() + subscription.cycle.slice(1) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={subscription.subscription_status}
                      color={getStatusColor(subscription.subscription_status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(subscription.start_date)}</TableCell>
                  <TableCell>{formatDate(subscription.end_date)}</TableCell>
                  <TableCell>₹{(subscription.amount_paid / 100).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={subscription.payment_status}
                      color={getPaymentStatusColor(subscription.payment_status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(subscription)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Subscription Details</DialogTitle>
        <DialogContent>
          {selectedSubscription && (
            <Box sx={{ py: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Plan Name</Typography>
                <Typography variant="body1">{selectedSubscription.plan_name}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Plan Features</Typography>
                {selectedSubscription.features && selectedSubscription.features.length > 0 ? (
                  <Box sx={{ mt: 1 }}>
                    {selectedSubscription.features.map((feature, idx) => (
                      <Chip
                        key={idx}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2">No specific features listed</Typography>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Billing Period</Typography>
                <Typography variant="body1">
                  {formatDate(selectedSubscription.start_date)} to {formatDate(selectedSubscription.end_date)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Subscription Status</Typography>
                <Chip
                  label={selectedSubscription.subscription_status}
                  color={getStatusColor(selectedSubscription.subscription_status)}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Amount Paid</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ₹{(selectedSubscription.amount_paid / 100).toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Payment Status</Typography>
                <Chip
                  label={selectedSubscription.payment_status}
                  color={getPaymentStatusColor(selectedSubscription.payment_status)}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Payment Date</Typography>
                <Typography variant="body1">
                  {formatDate(selectedSubscription.payment_date)}
                </Typography>
              </Box>

              {selectedSubscription.razorpay_payment_id && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Razorpay Payment ID</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {selectedSubscription.razorpay_payment_id}
                  </Typography>
                </Box>
              )}

              {selectedSubscription.razorpay_order_id && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Razorpay Order ID</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {selectedSubscription.razorpay_order_id}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Max Users</Typography>
                <Typography variant="body1">{selectedSubscription.max_users || 'Unlimited'}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default SubscriptionHistory;
