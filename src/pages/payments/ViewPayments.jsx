import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { getPayments, updatePaymentStatus } from '../../network/api';

const ViewPayments = () => {
  const [payments, setPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    try {
      const result = await getPayments({ status: statusFilter });
      if (result.status === 200) {
        setPayments(result.data);
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to fetch payments', severity: 'error' });
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setSnackbar({ open: true, message: 'Failed to fetch payments', severity: 'error' });
    }
  };

  const handleStatusChange = async () => {
    try {
      const result = await updatePaymentStatus({
        payment_id: selectedPayment.id,
        payment_status: newStatus
      });
      if (result.status === 200) {
        setSnackbar({ open: true, message: 'Payment status updated successfully', severity: 'success' });
        setOpenDialog(false);
        fetchPayments();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to update status', severity: 'error' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'refunded': return 'info';
      default: return 'default';
    }
  };

  const columnDefs = [
    { field: 'id', headerName: 'Payment ID', width: 100 },
    { field: 'order_number', headerName: 'Order Number', width: 150 },
    { field: 'customer_name', headerName: 'Customer', width: 150 },
    { field: 'payment_method', headerName: 'Method', width: 100 },
    {
      field: 'payment_status',
      headerName: 'Status',
      width: 120,
      cellRenderer: (params) => (
        <Chip label={params.value} color={getStatusColor(params.value)} size="small" />
      )
    },
    { field: 'amount', headerName: 'Amount', width: 100, valueFormatter: (params) => `₹${params.value}` },
    { field: 'payment_date', headerName: 'Date', width: 120 },
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setSelectedPayment(params.data);
            setNewStatus(params.data.payment_status);
            setOpenDialog(true);
          }}
        >
          Update Status
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payments Management
      </Typography>

      <Box sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="refunded">Refunded</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className="ag-theme-alpine" sx={{ height: 600, width: '100%' }}>
        <AgGridReact
          rowData={payments}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={20}
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusChange} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewPayments;
