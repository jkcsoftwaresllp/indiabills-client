import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { 
  getReconciliationById, 
  getReconciliationDetails, 
  updateReconciliationStatus 
} from '../../network/api';
import PageAnimate from '../../components/Animate/PageAnimate';
import { 
  Button, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const InspectReconciliation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();
  
  const [reconciliation, setReconciliation] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reconciliationData, detailsData] = await Promise.all([
          getReconciliationById(id),
          getReconciliationDetails(id)
        ]);
        
        setReconciliation(reconciliationData);
        setDetails(detailsData);
      } catch (error) {
        console.error('Error fetching reconciliation data:', error);
        errorPopup('Failed to load reconciliation data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, errorPopup]);

  const handleStatusUpdate = async (newStatus) => {
    const response = await updateReconciliationStatus(id, { status: newStatus });
    
    if (response === 200) {
      successPopup(`Reconciliation ${newStatus} successfully!`);
      setReconciliation(prev => ({ ...prev, status: newStatus }));
    } else {
      errorPopup(`Failed to ${newStatus} reconciliation`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'warning',
      'in_progress': 'info',
      'completed': 'success',
      'cancelled': 'error'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <PageAnimate>
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <Typography>Loading reconciliation data...</Typography>
        </Box>
      </PageAnimate>
    );
  }

  if (!reconciliation) {
    return (
      <PageAnimate>
        <Box p={4}>
          <Typography variant="h6">Reconciliation not found</Typography>
        </Box>
      </PageAnimate>
    );
  }

  return (
    <PageAnimate>
      <Box p={4}>
        <div className="flex items-center justify-between mb-6">
          <button 
            className="flex items-center" 
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewIcon /> Go back
          </button>
          
          <div className="flex gap-2">
            {reconciliation.status === 'pending' && (
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => handleStatusUpdate('in_progress')}
              >
                Start Reconciliation
              </Button>
            )}
            {reconciliation.status === 'in_progress' && (
              <>
                <Button 
                  variant="contained" 
                  color="success"
                  onClick={() => handleStatusUpdate('completed')}
                >
                  Complete
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => handleStatusUpdate('cancelled')}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="mb-6">
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Reconciliation #{reconciliation.id}
            </Typography>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                <Chip 
                  label={reconciliation.status?.replace('_', ' ').toUpperCase()} 
                  color={getStatusColor(reconciliation.status)}
                  size="small"
                />
              </div>
              <div>
                <Typography variant="subtitle2" color="textSecondary">Warehouse ID</Typography>
                <Typography variant="body1">{reconciliation.warehouseId}</Typography>
              </div>
              <div>
                <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                <Typography variant="body1">
                  {new Date(reconciliation.reconciliationDate).toLocaleDateString()}
                </Typography>
              </div>
              <div>
                <Typography variant="subtitle2" color="textSecondary">Total Discrepancies</Typography>
                <Typography variant="body1" className={reconciliation.totalDiscrepancies > 0 ? 'text-red-600' : 'text-green-600'}>
                  {reconciliation.totalDiscrepancies}
                </Typography>
              </div>
            </div>

            {reconciliation.notes && (
              <div>
                <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                <Typography variant="body1">{reconciliation.notes}</Typography>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6">Reconciliation Details</Typography>
              {(reconciliation.status === 'pending' || reconciliation.status === 'in_progress') && (
                <Button 
                  variant="outlined"
                  onClick={() => navigate(`/inventory/reconciliations/${id}/add`)}
                >
                  Add Items
                </Button>
              )}
            </div>

            {details.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product ID</TableCell>
                      <TableCell>Batch ID</TableCell>
                      <TableCell>System Qty</TableCell>
                      <TableCell>Counted Qty</TableCell>
                      <TableCell>Variance</TableCell>
                      <TableCell>Unit Cost</TableCell>
                      <TableCell>Variance Value</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell>{detail.productId}</TableCell>
                        <TableCell>{detail.batchId}</TableCell>
                        <TableCell>{detail.systemQuantity}</TableCell>
                        <TableCell>{detail.countedQuantity}</TableCell>
                        <TableCell className={detail.variance !== 0 ? (detail.variance > 0 ? 'text-green-600' : 'text-red-600') : ''}>
                          {detail.variance}
                        </TableCell>
                        <TableCell>₹{detail.unitCost}</TableCell>
                        <TableCell className={detail.varianceValue !== 0 ? (detail.varianceValue > 0 ? 'text-green-600' : 'text-red-600') : ''}>
                          ₹{detail.varianceValue}
                        </TableCell>
                        <TableCell>{detail.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" color="textSecondary" className="text-center py-8">
                No reconciliation details found. Click "Add Items" to start counting.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </PageAnimate>
  );
};

export default InspectReconciliation;