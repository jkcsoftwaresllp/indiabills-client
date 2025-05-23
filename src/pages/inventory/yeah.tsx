import React from 'react';
import {
  Modal,
  Typography,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { subBatch, Batch, StockIssue } from '../../definitions/Types';
import { formatToIndianCurrency } from '../../utils/FormHelper';

interface Options {
  id: number;
  name: string;
}

interface BatchInvoicePreviewProps {
  open: boolean;
  handleClose: () => void;
  formData: Batch;
  selectedProducts: subBatch[];
  totalPrice: number;
  selectedSupplier: Options | null;
  selectedLocation: Options | null;
  stockIssues: StockIssue[];
}

const BatchInvoicePreview: React.FC<BatchInvoicePreviewProps> = ({
  open,
  handleClose,
  formData,
  selectedProducts,
  totalPrice,
  selectedSupplier,
  selectedLocation,
  stockIssues
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ p: 4, backgroundColor: 'white', margin: '5% auto', maxWidth: '80%' }}>
        <Typography variant="h4" gutterBottom>
          Batch Invoice Preview
        </Typography>
        <Divider />
        <Box mt={2}>
          <Typography variant="h6">Batch Details:</Typography>
          <Typography>Batch Number: {formData.batchNumber}</Typography>
          <Typography>Reference Number: {formData.referenceNumber}</Typography>
          <Typography>Entry Date: {formData.entryDate}</Typography>
          <Typography>Warehouse: {selectedLocation?.name}</Typography>
          <Typography>Supplier: {selectedSupplier?.name}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="h6">Products:</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Stock Issue Quantity</TableCell>
                  <TableCell align="right">Unit Price (incl. tax)</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProducts.map((product, index) => {
                  const productPrice = product.recordUnitPrice || 0;
                  const totalQuantity = product.quantity;
                  const faultyQuantity = stockIssues
                    .filter((issue) => issue.itemName === product.itemName)
                    .reduce((sum, issue) => sum + issue.faultyQuantity, 0);

                  const discountedPrice =
                    product.discountType === 'percentage'
                      ? productPrice * totalQuantity * (1 - product.discount / 100)
                      : productPrice * totalQuantity - product.discount;

                  return (
                    <TableRow key={index}>
                      <TableCell>{product.itemName}</TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">{faultyQuantity}</TableCell>
                      <TableCell align="right">
                        ₹{formatToIndianCurrency(productPrice.toFixed(2))}
                      </TableCell>
                      <TableCell align="right">
                        {product.discountType === 'percentage'
                          ? `${product.discount}%`
                          : `₹${product.discount}`}
                      </TableCell>
                      <TableCell align="right">
                        ₹{formatToIndianCurrency(discountedPrice.toFixed(2))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="h6">Total Price:</Typography>
          <Typography variant="h4">
            ₹{formatToIndianCurrency(totalPrice.toFixed(2))}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default BatchInvoicePreview;