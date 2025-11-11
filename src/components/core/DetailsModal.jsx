import { FiX } from 'react-icons/fi';
import { Dialog, DialogTitle, DialogContent, IconButton, Grid, Typography, Box } from '@mui/material';

const DetailsModal = ({ open, onClose, data, columns, title }) => {
  if (!data) return null;

  const displayColumns = columns.filter(col => col.field && data.hasOwnProperty(col.field));

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '16px',
          padding: '8px'
        }
      }}
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">{title} Details</span>
          <IconButton onClick={onClose} size="small">
            <FiX />
          </IconButton>
        </div>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {displayColumns.length > 0 ? displayColumns.map((col) => (
            <Grid item xs={12} sm={6} key={col.field}>
              <Box>
                <Typography variant="caption" color="textSecondary" style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                  {col.headerName || col.field}
                </Typography>
                <Typography variant="body2" style={{ marginTop: '4px', wordBreak: 'break-word' }}>
                  {data[col.field] !== null && data[col.field] !== undefined 
                    ? String(data[col.field]) 
                    : 'N/A'}
                </Typography>
              </Box>
            </Grid>
          )) : (
            <Grid item xs={12}>
              <p className="text-gray-500">No data to display</p>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsModal;
