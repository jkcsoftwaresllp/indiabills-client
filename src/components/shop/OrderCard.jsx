import { FiTrash2 } from 'react-icons/fi';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import { useStore } from '../../store/store';

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

const OrderCard = ({ products }) => {
  const {
    selectedProducts,
    updateProductVariants,
    removeSelectedProduct,
  } = useStore((state) => ({
    selectedProducts: state.selectedProducts,
    updateProductVariants: state.updateProductVariants,
    removeSelectedProduct: state.removeSelectedProduct,
  }));

  const handleQuantityChange = (itemId, e) => {
    const value = Number(e.target.value);
    const product = products.find((p) => p.itemId === itemId);
    if (!product) return;

    if (value > product.currentQuantity) {
      // Handle error: Quantity exceeds available stock
      return;
    }
    if (value < 1) {
      // Handle error: Quantity must be at least 1
      return;
    }
    updateProductVariants(itemId, {
      ...selectedProducts[itemId],
      quantity: value,
    });
  };

  const handleSalePriceChange = (itemId, e) => {
    const value = Number(e.target.value);
    if (value < 0) {
      // Handle error: Sale price cannot be negative
      return;
    }
    updateProductVariants(itemId, {
      ...selectedProducts[itemId],
      salePrice: value,
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="order table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell>HSN</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Sale Price</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => {
            const selectedProduct = selectedProducts[product.itemId] || {};
            return (
              <TableRow key={product.itemId}>
                <TableCell className="capitalize">{product.itemName}</TableCell>
                <TableCell>{product.hsn}</TableCell>
                <TableCell>
                  <TextField
                    name="quantity"
                    type="number"
                    value={selectedProduct.quantity || 1}
                    onChange={(e) => handleQuantityChange(product.itemId, e)}
                    fullWidth
                    sx={textFieldStyles}
                    inputProps={{ min: 1 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="salePrice"
                    type="number"
                    value={
                      selectedProduct.salePrice || product.salePrice || 0
                    }
                    onChange={(e) => handleSalePriceChange(product.itemId, e)}
                    fullWidth
                    sx={textFieldStyles}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Remove Product" arrow>
                    <IconButton
                      onClick={() => removeSelectedProduct(product.itemId)}
                      color="secondary"
                    >
                      <FiTrash2 />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderCard;
