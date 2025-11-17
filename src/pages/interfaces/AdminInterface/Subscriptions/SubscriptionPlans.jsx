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
  DialogActions,
  Paper
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 1, px: 1 }}>
      {error && (
         <Alert severity="error" sx={{ mb: 2, borderRadius: 1.25, fontSize: '0.9rem' }}>
           {error}
         </Alert>
       )}

       {orderError && (
         <Alert severity="error" sx={{ mb: 2, borderRadius: 1.25, fontSize: '0.9rem' }}>
           {orderError}
         </Alert>
       )}

      {plans.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 1.5, border: '2px dashed #e0e0e0', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
          <Typography variant="body1" color="textSecondary">
            No subscription plans available at this time.
          </Typography>
        </Paper>
      ) : (
        <Box 
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            overflowY: 'hidden',
            pb: 1,
            px: 1,
            py: 0.5,
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              height: '6px'
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f5f9',
              borderRadius: '10px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#cbd5e1',
              borderRadius: '10px',
              '&:hover': {
                background: '#94a3b8'
              }
            }
          }}
        >
          {plans.map((plan, idx) => {
            const isFeatured = idx === 1 || idx === Math.floor(plans.length / 2);
            return (
                <Card
                    sx={{
                      height: '630px',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      minWidth: '360px',
                      width: '360px',
                      border: isFeatured ? '2px solid' : '1px solid #e0e0e0',
                      borderColor: isFeatured ? 'primary.main' : '#e0e0e0',
                      boxShadow: isFeatured ? '0 15px 30px rgba(30, 41, 56, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: 2,
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: isFeatured ? '0 20px 40px rgba(30, 41, 56, 0.25)' : '0 8px 16px rgba(0, 0, 0, 0.12)',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                   {isFeatured && (
                     <Box
                       sx={{
                         background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                         color: 'white',
                         py: 0.6,
                         px: 2,
                         textAlign: 'center',
                         fontSize: '0.8rem',
                         fontWeight: 700,
                         letterSpacing: '0.05em',
                         width: '100%'
                       }}
                     >
                       MOST POPULAR
                     </Box>
                   )}

                  <CardContent sx={{ flex: 1, pt: 2, px: 2.5, py: 2, overflowY: 'auto' }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 800, 
                        mb: 0.75,
                        fontSize: '1.3rem',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {plan.name}
                    </Typography>
                    
                    {plan.description && (
                      <Typography 
                        variant="caption" 
                        color="textSecondary" 
                        sx={{ 
                          mb: 1.5,
                          fontSize: '0.85rem',
                          lineHeight: 1.4,
                          display: 'block'
                        }}
                      >
                        {plan.description}
                      </Typography>
                    )}

                    <Box 
                       sx={{ 
                         mb: 2, 
                         pb: 1.75, 
                         borderBottom: '1px solid #f0f0f0',
                         background: isFeatured ? 'linear-gradient(135deg, rgba(30, 41, 56, 0.05), rgba(196, 32, 50, 0.05))' : 'transparent',
                         p: 1.5,
                         borderRadius: 1.5,
                         mx: -2.5,
                         px: 1.5,
                         mt: 0.75
                       }}
                     >
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 900, 
                          color: 'primary.main',
                          letterSpacing: '-0.02em',
                          fontSize: '1.8rem'
                        }}
                      >
                        {plan.price_display || `₹${plan.price_yearly}`}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                        Yearly
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                       <Typography 
                         variant="caption" 
                         sx={{ 
                           fontWeight: 700, 
                           mb: 0.75,
                           fontSize: '0.8rem',
                           textTransform: 'uppercase',
                           letterSpacing: '0.05em',
                           color: '#64748b',
                           display: 'block'
                         }}
                       >
                         Includes:
                       </Typography>
                      <List sx={{ py: 0 }}>
                        {plan.features && plan.features.length > 0 ? (
                          plan.features.map((feature, idx) => (
                            <ListItem 
                              key={idx} 
                              sx={{ 
                                py: 0.45, 
                                px: 0,
                                alignItems: 'flex-start'
                              }}
                            >
                              <CheckCircle 
                                sx={{ 
                                  color: 'success.main', 
                                  mr: 0.9, 
                                  mt: 0.25,
                                  fontSize: '0.95rem',
                                  flexShrink: 0
                                }} 
                              />
                              <ListItemText
                                primary={feature}
                                primaryTypographyProps={{ 
                                  variant: 'caption',
                                  sx: { fontWeight: 500, fontSize: '0.9rem' }
                                }}
                              />
                            </ListItem>
                          ))
                          ) : (
                          <ListItem sx={{ py: 0.45, px: 0, alignItems: 'flex-start' }}>
                            <CheckCircle 
                              sx={{ 
                                color: 'success.main', 
                                mr: 0.9, 
                                mt: 0.25,
                                fontSize: '0.95rem',
                                flexShrink: 0
                              }} 
                            />
                            <ListItemText 
                              primary="All features" 
                              primaryTypographyProps={{ 
                                variant: 'caption',
                                sx: { fontWeight: 500, fontSize: '0.9rem' }
                              }} 
                            />
                          </ListItem>
                          )}
                      </List>
                    </Box>

                    {plan.max_users && (
                      <Box sx={{ mt: 1.5 }}>
                        <Chip
                          label={`${plan.max_users} users`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            fontSize: '0.85rem',
                            height: '26px',
                            backgroundColor: 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(30, 41, 56, 0.1)'
                            }
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ pt: 1, pb: 2, px: 2.5 }}>
                    <Button
                      variant={isFeatured ? 'contained' : 'outlined'}
                      color="primary"
                      fullWidth
                      onClick={() => handleSelectPlan(plan)}
                      disabled={processingOrder}
                      size="medium"
                      sx={{
                        py: 1.1,
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        textTransform: 'none',
                        borderRadius: 1.2,
                        transition: 'all 0.3s ease',
                        '&:hover:not(:disabled)': {
                          boxShadow: isFeatured ? '0 8px 16px rgba(30, 41, 56, 0.2)' : '0 4px 8px rgba(30, 41, 56, 0.15)'
                        }
                      }}
                    >
                      {processingOrder ? 'Processing...' : 'Subscribe'}
                    </Button>
                  </CardActions>
                  </Card>
                  );
                  })}
                  </Box>
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
                  </Box>
                  );
                  };

                  export default SubscriptionPlans;
