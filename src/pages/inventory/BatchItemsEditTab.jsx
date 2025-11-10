import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, FormControl, Select, MenuItem, InputLabel, } from '@mui/material';

const BatchItemsEditTab = ({ items, availableItems, handleItemChange, handleDeleteItem, handleAddItem, }) => {

  const selectedItemIds = items.map((item) => item.itemId).filter((id) => id !== undefined && id !== null);
  const getAvailableItems = (currentItemId) => { return availableItems.filter( (item) => item.id === currentItemId || !selectedItemIds.includes(item.id) ); };

  return (
    <div>
      <h3>Sub-Batches</h3>
      <Button variant="contained" color="primary" onClick={handleAddItem} style={{ marginBottom: '16px' }} >
        Add Sub-Batch
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="sub-batches table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Pack Size</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Discount Type</TableCell>
              <TableCell>Manufacture Date</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Item</InputLabel>
                    <Select name="itemId" value={item.itemId || ''} onChange={(e) => handleItemChange(item.id, e)} label="Item">
                      {getAvailableItems(item.itemId).map((availableItem) => ( <MenuItem key={availableItem.id} value={availableItem.id}> {availableItem.name} </MenuItem> ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField name="quantity" type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, e)} fullWidth inputProps={{ min: 0 }} />
                </TableCell>
                <TableCell>
                  <TextField name="packSize" type="number" value={item.packSize} onChange={(e) => handleItemChange(item.id, e)} fullWidth inputProps={{ min: 0 }} />
                </TableCell>
                <TableCell>
                  <TextField name="recordUnitPrice" type="number" value={item.recordUnitPrice} onChange={(e) => handleItemChange(item.id, e)} fullWidth inputProps={{ min: 0 }} />
                </TableCell>
                <TableCell>
                  <TextField name="discount" type="text" value={item.discount} onChange={(e) => handleItemChange(item.id, e)} fullWidth />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Discount Type</InputLabel>
                    <Select name="discountType" value={item.discountType} onChange={(e) => handleItemChange(item.id, e)} label="Discount Type" >
                      <MenuItem value="percentage">Percentage</MenuItem>
                      <MenuItem value="value">Value</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField name="manufactureDate" type="date" value={item.manufactureDate} onChange={(e) => handleItemChange(item.id, e)} fullWidth InputLabelProps={{ shrink: true, }} />
                </TableCell>
                <TableCell>
                  <TextField name="expiryDate" type="date" value={item.expiryDate} onChange={(e) => handleItemChange(item.id, e)} fullWidth InputLabelProps={{ shrink: true, }} />
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

export default BatchItemsEditTab;
