import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { getSubscriptionPlans, createSubscriptionOrder } from '../../../../network/api/subscriptionApi';
import PaymentModal from './PaymentModal';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedCycle, setSelectedCycle] = useState('yearly');
  const [paymentData, setPaymentData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [cycleDialog, setCycleDialog] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSubscriptionPlans();
      
      if (response.status === 200 && response.data.success) {
        setPlans(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to load subscription plans');
      }
    } catch (err) {
      setError('Error fetching subscription plans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setCycleDialog(true);
  };

  const handleCycleSelect = async (cycle) => {
    if (!selectedPlan) return;
    
    setCycleDialog(false);
    setProcessingOrder(true);
    setOrderError(null);

    try {
      const response = await createSubscriptionOrder(selectedPlan.id, cycle);
      
      if (response.status === 200 && response.data.success) {
        setPaymentData({
          ...response.data.data,
          planId: selectedPlan.id,
          cycle
        });
        setShowPaymentModal(true);
      } else {
        setOrderError(response.data.message || 'Failed to create order');
      }
    } catch (err) {
      setOrderError('Error creating subscription order');
      console.error(err);
    } finally {
      setProcessingOrder(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setPaymentData(null);
    // Refresh subscription history or show success message
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
          Subscription Plans
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Choose a plan that best fits your business needs
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orderError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {orderError}
        </Alert>
      )}

      {plans.length === 0 ? (
        <Alert severity="info">No subscription plans available</Alert>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {plan.name}
                  </Typography>
                  
                  <Box sx={{ mb: 2, py: 1, borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {plan.price_display || `₹${plan.price_yearly}`}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Per year
                    </Typography>
                  </Box>

                  {plan.description && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {plan.description}
                    </Typography>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Features:
                    </Typography>
                    <List sx={{ py: 0 }}>
                      {plan.features && plan.features.length > 0 ? (
                        plan.features.map((feature, idx) => (
                          <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                            <ListItemText
                              primary={feature}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem sx={{ py: 0.5, px: 0 }}>
                          <ListItemText primary="All features included" primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItem>
                      )}
                    </List>
                  </Box>

                  {plan.max_users && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`Max Users: ${plan.max_users}`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ pt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleSelectPlan(plan)}
                    disabled={processingOrder}
                  >
                    {processingOrder ? 'Processing...' : 'Subscribe Now'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cycle Selection Dialog */}
      <Dialog open={cycleDialog} onClose={() => setCycleDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Select Billing Cycle</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Choose how you would like to be billed:
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCycleDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleCycleSelect('yearly')}
            disabled={processingOrder}
          >
            Yearly
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Modal */}
      {showPaymentModal && paymentData && (
        <PaymentModal
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          paymentData={paymentData}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </Container>
  );
};

export default SubscriptionPlans;
