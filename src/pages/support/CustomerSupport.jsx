import { FiHeadphones, FiMessageCircle, FiPlus, FiStar } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Chip,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { getData, addRow } from '../../network/api';
import { useStore } from '../../store/store';
import PageAnimate from '../../components/Animate/PageAnimate';

const CustomerSupport = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { successPopup, errorPopup } = useStore();

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
    orderId: ''
  });

  const [reviewForm, setReviewForm] = useState({
    productId: '',
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await getData('/ops/sales/portal/customer/support/tickets');
      if (response.success) {
        setTickets(response.data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleCreateTicket = async () => {
    setLoading(true);
    try {
      const response = await addRow('/ops/sales/portal/customer/support/tickets', ticketForm);
      if (response === 200 || response === 201) {
        successPopup('FiHeadphones ticket created successfully');
        setOpenTicketDialog(false);
        setTicketForm({
          subject: '',
          description: '',
          category: 'general',
          priority: 'medium',
          orderId: ''
        });
        fetchTickets();
      } else {
        errorPopup('Failed to create support ticket');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      errorPopup('Failed to create support ticket');
    }
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    setLoading(true);
    try {
      const response = await addRow('/ops/sales/portal/customer/support/reviews', reviewForm);
      if (response === 200 || response === 201) {
        successPopup('Review submitted successfully');
        setOpenReviewDialog(false);
        setReviewForm({
          productId: '',
          rating: 5,
          title: '',
          comment: ''
        });
      } else {
        errorPopup('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      errorPopup('Failed to submit review');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'primary';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <PageAnimate>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Customer FiHeadphones
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Support Tickets" icon={<FiHeadphones />} />
        <Tab label="Product Reviews" icon={<FiStar />} />
        </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">My FiHeadphones Tickets</Typography>
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => setOpenTicketDialog(true)}
              >
                Create Ticket
              </Button>
            </Box>

            <Grid container spacing={2}>
              {tickets.map((ticket) => (
                <Grid item xs={12} md={6} key={ticket.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" noWrap>
                          {ticket.subject}
                        </Typography>
                        <Box>
                          <Chip 
                            label={ticket.status} 
                            color={getStatusColor(ticket.status)}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip 
                            label={ticket.priority} 
                            color={getPriorityColor(ticket.priority)}
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {ticket.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Category: {ticket.category} | Created: {new Date(ticket.created_at).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {tickets.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No support tickets found. Create your first ticket to get help.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Product Reviews</Typography>
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => setOpenReviewDialog(true)}
              >
                Write Review
              </Button>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Review management coming soon...
            </Typography>
          </Box>
        )}

        {/* Create Ticket Dialog */}
        <Dialog open={openTicketDialog} onClose={() => setOpenTicketDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create FiHeadphones Ticket</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Subject"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                sx={{ mb: 2 }}
                required
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      label="Category"
                    >
                      <MenuItem value="order">Order</MenuItem>
                      <MenuItem value="product">Product</MenuItem>
                      <MenuItem value="delivery">Delivery</MenuItem>
                      <MenuItem value="payment">Payment</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                      label="Priority"
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Order ID (Optional)"
                    value={ticketForm.orderId}
                    onChange={(e) => setTicketForm({ ...ticketForm, orderId: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTicketDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateTicket} 
              variant="contained"
              disabled={loading || !ticketForm.subject || !ticketForm.description}
            >
              Create Ticket
            </Button>
          </DialogActions>
        </Dialog>

        {/* Write Review Dialog */}
        <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Write Product Review</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Product ID"
                value={reviewForm.productId}
                onChange={(e) => setReviewForm({ ...reviewForm, productId: e.target.value })}
                sx={{ mb: 2 }}
                required
              />

              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  value={reviewForm.rating}
                  onChange={(e, newValue) => setReviewForm({ ...reviewForm, rating: newValue })}
                />
              </Box>

              <TextField
                fullWidth
                label="Review Title"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Review Comment"
                multiline
                rows={4}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitReview} 
              variant="contained"
              disabled={loading || !reviewForm.productId}
            >
              Submit Review
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageAnimate>
  );
};

export default CustomerSupport;