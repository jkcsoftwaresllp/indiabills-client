import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';

const REASON_OPTIONS = [
  { value: 'leakage', label: 'Leakage' },
  { value: 'breakage', label: 'Breakage' },
  { value: 'shortage', label: 'Shortage' },
  { value: 'bbd', label: 'BBD' },
];

const StockIssuesEditTab = ({
  issues,
  availableItems,
  handleIssueChange,
  handleDeleteIssue,
  handleAddIssue,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold">Stock Issues</h3>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddIssue}
        style={{ marginBottom: '16px' }}
      >
        Add Stock Issue
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="stock issues table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Faulty Quantity</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Item</InputLabel>
                    <Select
                      name="itemId"
                      value={issue.itemId || ''}
                      onChange={(e) => handleIssueChange(issue.id, e)}
                      label="Item"
                    >
                      {availableItems.map((availableItem) => (
                        <MenuItem
                          key={availableItem.id}
                          value={availableItem.id}
                        >
                          {availableItem.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    name="faultyQuantity"
                    type="number"
                    value={issue.faultyQuantity}
                    onChange={(e) => handleIssueChange(issue.id, e)}
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="remarks"
                    value={issue.remarks}
                    onChange={(e) => handleIssueChange(issue.id, e)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Reason</InputLabel>
                    <Select
                      name="reason"
                      value={issue.reason || ''}
                      onChange={(e) => handleIssueChange(issue.id, e)}
                      label="Reason"
                    >
                      {REASON_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <p
                    onClick={() => handleDeleteIssue(issue.id)}
                    className="text-sm font-bold text-rose-700 cursor-pointer"
                  >
                    x
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StockIssuesEditTab;
