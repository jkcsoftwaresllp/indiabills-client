import { FiChevronDown, FiHeadphones, FiMail, FiPhone, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import PageAnimate from '../../components/Animate/PageAnimate';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box
} from '@mui/material';

const CustomerSupport = () => {
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium',
    orderId: ''
  });

  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: 'Order delivery issue',
      category: 'delivery',
      status: 'open',
      priority: 'high',
      createdAt: '2025-01-15',
      orderId: 'ORD-001'
    },
    {
      id: 2,
      subject: 'Product quality concern',
      category: 'product',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2025-01-10',
      orderId: 'ORD-002'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to create support ticket
    console.log('Creating ticket:', ticketForm);
    
    // Add to local state for demo
    const newTicket = {
      id: tickets.length + 1,
      ...ticketForm,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTickets(prev => [newTicket, ...prev]);
    
    // Reset form
    setTicketForm({
      subject: '',
      description: '',
      category: '',
      priority: 'medium',
      orderId: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'warning';
      case 'in_progress': return 'info';
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
      <div className="w-full p-6">
        <div className="mb-6 p-6 bg-blue-50 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Customer FiHeadphones</h1>
          <p className="text-gray-600">Get help with your orders, products, and account</p>
        </div>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom className="flex items-center gap-2">
                  <FiHeadphones />
                  Contact Us
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiMail color="primary" />
                    <div>
                      <Typography variant="body2" color="textSecondary">Email</Typography>
                      <Typography variant="body1">support@indiabills.com</Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone color="primary" />
                    <div>
                      <Typography variant="body2" color="textSecondary">Phone</Typography>
                      <Typography variant="body1">+91 1800-123-4567</Typography>
                    </div>
                  </div>
                  <Divider />
                  <div>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Business Hours
                    </Typography>
                    <Typography variant="body1">Mon - Fri: 9:00 AM - 6:00 PM</Typography>
                    <Typography variant="body1">Sat: 10:00 AM - 4:00 PM</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Create New Ticket */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Create FiHeadphones Ticket</Typography>
                <form onSubmit={handleSubmitTicket}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={ticketForm.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                          name="category"
                          value={ticketForm.category}
                          onChange={handleInputChange}
                          required
                        >
                          <MenuItem value="order">Order Issue</MenuItem>
                          <MenuItem value="product">Product Issue</MenuItem>
                          <MenuItem value="delivery">Delivery Issue</MenuItem>
                          <MenuItem value="payment">Payment Issue</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          name="priority"
                          value={ticketForm.priority}
                          onChange={handleInputChange}
                        >
                          <MenuItem value="low">Low</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Order ID (Optional)"
                        name="orderId"
                        value={ticketForm.orderId}
                        onChange={handleInputChange}
                        placeholder="ORD-123"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={ticketForm.description}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" size="large">
                        Submit Ticket
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* My Tickets */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>My FiHeadphones Tickets</Typography>
                {tickets.length > 0 ? (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <Accordion key={ticket.id}>
                        <AccordionSummary expandIcon={<FiChevronDown />}>
                          <div className="flex justify-between items-center w-full mr-4">
                            <div>
                              <Typography variant="subtitle1">{ticket.subject}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Ticket #{ticket.id} • {ticket.createdAt}
                              </Typography>
                            </div>
                            <div className="flex gap-2">
                              <Chip 
                                label={ticket.status} 
                                color={getStatusColor(ticket.status)} 
                                size="small" 
                              />
                              <Chip 
                                label={ticket.priority} 
                                color={getPriorityColor(ticket.priority)} 
                                size="small" 
                              />
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="space-y-2">
                            <div>
                              <Typography variant="body2" color="textSecondary">Category:</Typography>
                              <Typography variant="body1" className="capitalize">{ticket.category}</Typography>
                            </div>
                            {ticket.orderId && (
                              <div>
                                <Typography variant="body2" color="textSecondary">Related Order:</Typography>
                                <Typography variant="body1">{ticket.orderId}</Typography>
                              </div>
                            )}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body1" color="textSecondary" className="text-center py-8">
                    No support tickets found
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </PageAnimate>
  );
};

export default CustomerSupport;