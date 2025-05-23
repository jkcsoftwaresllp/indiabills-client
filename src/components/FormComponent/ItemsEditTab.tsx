import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Button, MenuItem, FormControl, InputLabel, Select, } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface Item {
  id: string;
  itemId?: number;
  itemName: string;
  hsn: string;
  unitMRP: number | string;
  quantity: number | string;
  discount: number | string;
  purchasePrice: number | string;
  salePrice: number | string;
  cess: number | string;
  sgst: number | string;
  cgst: number | string;
}

interface ItemsEditTableProps {
  items: Item[];
  availableItems: {
    id: number;
    name: string;
    hsn: string;
    purchaseRate: number;
    unitPrice: number;
    price: number;
    cess: number;
    cgst: number;
    sgst: number;
    packSize: number;
  }[];
  handleItemChange: (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleDeleteItem: (id: string) => void;
  handleAddItem: () => void;
}

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.875rem',
  },
};

const ItemsEditTab: React.FC<ItemsEditTableProps> = ({ items, handleItemChange, handleDeleteItem, handleAddItem, availableItems, }) => {
  // Get all selected item IDs
  const selectedItemIds = items
    .map((item) => item.itemId)
    .filter((id) => id !== undefined && id !== null);

  // Function to get available items for each row
  const getAvailableItems = (currentItemId: number | undefined) => {
    return availableItems.filter(
      (item) => item.id === currentItemId || !selectedItemIds.includes(item.id)
    );
  };

  return (
    <div>
      <h3>Items</h3>
      <Button variant="contained" color="primary" onClick={handleAddItem} style={{ marginBottom: '16px' }} >
        Add Item
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="items table" size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '0.875rem', padding: '8px', width: '20%' }}>
                Item Name
              </TableCell>
              <TableCell sx={{ fontSize: '0.875rem', padding: '8px', width: '10%' }}>
                Quantity
              </TableCell>
              <TableCell sx={{ fontSize: '0.875rem', padding: '8px', width: '10%' }}>
                Discount
              </TableCell>
              <TableCell sx={{ fontSize: '0.875rem', padding: '8px', width: '10%' }}>
                Purchase Rate
              </TableCell>
              <TableCell sx={{ fontSize: '0.875rem', padding: '8px', width: '10%' }}>
                Sale Rate
              </TableCell>
              <TableCell sx={{ fontSize: '0.875rem', padding: '8px', width: '10%' }}>
                CESS
              </TableCell>
              <TableCell sx={{ fontSize: '0.875rem', padding: '8px', width: '10%' }}>
                SGST
              </TableCell>
              <TableCell sx={{ fontSize: '0.875rem', padding: '8px', width: '10%' }}>
                CGST
              </TableCell>
              <TableCell sx={{ width: '2%' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="item">Item</InputLabel>
                    <Select name="itemId" value={item.itemId || ''} onChange={(e) => handleItemChange(item.id, e)} label="Item" sx={textFieldStyles} >
                      {getAvailableItems(item.itemId).map((availableItem) => (
                        <MenuItem key={availableItem.id} value={availableItem.id}>
                          {availableItem.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField name="quantity" type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, e)} fullWidth sx={textFieldStyles} inputProps={{ min: 1 }} />
                </TableCell>
                <TableCell>
                  <TextField name="discount" type="number" value={item.discount} onChange={(e) => handleItemChange(item.id, e)} variant="outlined" size="small" inputProps={{ min: 0, step: 0.0001 }} fullWidth sx={textFieldStyles} />
                </TableCell>
                <TableCell>
                  <TextField name="purchasePrice" type="number" value={item.purchasePrice} onChange={(e) => handleItemChange(item.id, e)} variant="outlined" size="small" inputProps={{ min: 0, step: 0.0001 }} fullWidth sx={textFieldStyles} />
                </TableCell>
                <TableCell>
                  <TextField name="salePrice" type="number" value={item.salePrice} onChange={(e) => handleItemChange(item.id, e)} variant="outlined" size="small" inputProps={{ min: 0, step: 0.0001 }} fullWidth sx={textFieldStyles} />
                </TableCell>
                <TableCell>
                  <TextField name="cess" type="number" value={item.cess} onChange={(e) => handleItemChange(item.id, e)} variant="outlined" size="small" inputProps={{ min: 0, step: 0.0001 }} fullWidth sx={textFieldStyles} />
                </TableCell>
                <TableCell>
                  <TextField name="sgst" type="number" value={item.sgst} onChange={(e) => handleItemChange(item.id, e)} variant="outlined" size="small" inputProps={{ min: 0, step: 0.0001 }} fullWidth sx={textFieldStyles} />
                </TableCell>
                <TableCell>
                  <TextField name="cgst" type="number" value={item.cgst} onChange={(e) => handleItemChange(item.id, e)} variant="outlined" size="small" inputProps={{ min: 0, step: 0.0001 }} fullWidth sx={textFieldStyles} />
                </TableCell>
                <TableCell> <p onClick={() => handleDeleteItem(item.id)} className='text-sm font-bold text-rose-700 cursor-pointer'>x</p> </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ItemsEditTab;
