import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const QuickEditModal = ({ open, onClose, data, columns, onSave, onDelete, title }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    console.log('QuickEditModal received data:', data);
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(data);
    }
  };

  const editableColumns = columns.filter(col => col.editable && col.field);

  console.log('Editable columns:', editableColumns);
  console.log('Form data:', formData);

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
          <span className="text-2xl font-bold">Quick Edit {title}</span>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {editableColumns.length > 0 ? editableColumns.map((col) => (
            <Grid item xs={12} sm={6} key={col.field}>
              <TextField
                fullWidth
                label={col.headerName}
                value={formData[col.field] ?? ''}
                onChange={(e) => handleChange(col.field, e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{
                  style: { textTransform: 'capitalize' }
                }}
              />
            </Grid>
          )) : (
            <Grid item xs={12}>
              <p className="text-gray-500">No editable fields available</p>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions className="p-4 gap-2">
        <Button 
          onClick={handleDelete} 
          variant="outlined" 
          color="error"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        <div className="flex-grow" />
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          startIcon={<SaveIcon />}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickEditModal;
