import { FiBox, FiCalendar, FiPlus, FiTrash2, FiShoppingBag, FiInfo, FiHeart } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Button,
  Modal,
  Box,
  Input,
  Tooltip,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useStore } from '../../store/store';
import { useRoutes } from '../../hooks/useRoutes';
import { addToCart, removeFromCart, toggleWishlist } from '../../network/api';



// --- Component ---
const ProductCard = ({ product }) => {
  const { getRoute } = useRoutes();
  const { cart, customerData, updateCustomerWishlist, errorPopup, successPopup } = useStore();
  const { items: cartItems } = cart;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [error, setError] = useState('');

  const productId = product.itemId || product.id;
  const cartItem = cartItems.find(item => item.product_id === productId);
  const isInCart = !!cartItem;
  const isInWishlist = customerData.wishlist.some(item => item.product_id === productId);

  const formatNumber = (num) =>
    num % 1 === 0 ? num.toString() : (Number(num) || 0).toFixed(2);



  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity || 1);
    } else {
      setQuantity(1);
      setSelectedVariants({});
    }
  }, [cartItem]);

  const handleConfirm = async () => {
    if (quantity <= 0) return setError('Quantity must be greater than zero');
    setError('');
    const result = await addToCart({ product_id: productId, quantity });
    if (result.status === 201 || result.status === 200) {
      successPopup('Product added to cart');
    } else {
      errorPopup(result.error);
    }
    setIsModalOpen(false);
  };

  const handleWishlistToggle = async () => {
    const result = await toggleWishlist(productId);
    if (result.status === 200) {
      // Update the store - but we need to refetch the wishlist or update locally
      // For now, let's toggle locally in the store
      const updatedWishlist = isInWishlist
        ? customerData.wishlist.filter(item => item.product_id !== productId)
        : [...customerData.wishlist, { product_id: productId }];
      updateCustomerWishlist(updatedWishlist);
    }
  };

  const handleRemove = async () => {
    const result = await removeFromCart({ product_id: productId });
    if (result.status === 200) {
      successPopup('Product removed from cart');
    } else {
      errorPopup(result.error);
    }
    setIsModalOpen(false);
    setQuantity(1);
    setSelectedVariants({});
  };

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const days = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 30 && days > 0;
  };

  const isLowStock = (q) => q <= (product.reorderLevel || 5);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="w-full max-w-sm rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all bg-white/70 backdrop-blur-md"
      >
        <CardContent className="p-5 relative">
          {/* Wishlist button */}
          <IconButton
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3"
            color={isInWishlist ? 'error' : 'default'}
          >
            {isInWishlist ? <FiHeart /> : <FiHeart />}
          </IconButton>

          {/* Product name + price */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <Typography variant="h6" className="font-semibold capitalize">
                {product.itemName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.manufacturer || 'Unknown'}
              </Typography>
            </div>
            <div className="text-right">
              <Typography variant="h6" className="text-blue-600 font-bold">
                ₹{formatNumber(product.salePrice)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (Inc. GST)
              </Typography>
            </div>
          </div>

          <Divider className="my-4" />

          {/* Stock & Expiry */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <FiBox className="text-gray-500" />
              <div>
                <Typography variant="body2" color="text.secondary">
                  In Stock
                </Typography>
                <Typography variant="body1" className="font-semibold flex items-center gap-2">
                  {product.currentQuantity}
                  {isLowStock(product.currentQuantity) && (
                    <Chip label="Low" size="small" color="warning" />
                  )}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-gray-500" />
              <div>
                <Typography variant="body2" color="text.secondary">
                  Expiry
                </Typography>
                <Typography variant="body1" className="font-semibold flex items-center gap-2">
                  {product.expiryDate ? (
                    <>
                      {new Date(product.expiryDate).toLocaleDateString()}
                      {isExpiringSoon(product.expiryDate) && (
                        <Chip label="Soon" size="small" color="error" />
                      )}
                    </>
                  ) : (
                    'No Expiry'
                  )}
                </Typography>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-xl p-3 mb-5 border border-gray-100">
            <Typography variant="body2" className="mb-2 flex items-center gap-1 text-gray-600 font-medium">
              <FiInfo /> Product Info
            </Typography>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Dimensions</div>
              <div className="text-right font-medium">{product.dimensions || '-'}</div>
              {product.packSize > 1 && (
                <>
                  <div className="text-gray-500">Pack Size</div>
                  <div className="text-right font-medium">{product.packSize}</div>
                </>
              )}
              <div className="text-gray-500">Weight</div>
              <div className="text-right font-medium">{product.weight}g</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
          <Button
          variant="contained"
          color={isInCart ? 'success' : 'primary'}
          startIcon={<FiShoppingBag />}
          onClick={() => setIsModalOpen(true)}
          fullWidth
          disabled={cart.loading}
          sx={{ textTransform: 'none', borderRadius: '10px', py: 1.2 }}
          >
          {cart.loading ? 'Adding...' : (isInCart ? 'Update Cart' : 'Add to Cart')}
          </Button>
            {isInCart && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<FiTrash2 />}
                onClick={handleRemove}
                fullWidth
                sx={{ borderRadius: '10px', py: 1.2 }}
              >
                Remove
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-96 border border-gray-100">
          <Typography variant="h6" className="mb-4 font-semibold">
            {product.itemName}
          </Typography>

          {product.variants?.map((variant, index) => (
            <div key={index} className="mb-4">
              <Typography variant="subtitle2" className="mb-2 font-medium text-gray-700">
                {variant.key}
              </Typography>
              <div className="flex flex-wrap gap-2">
                {variant.values.filter(Boolean).map((value, idx) => (
                  <Button
                    key={idx}
                    size="small"
                    variant={
                      selectedVariants[variant.key] === value ? 'contained' : 'outlined'
                    }
                    onClick={() =>
                      setSelectedVariants((prev) => ({
                        ...prev,
                        [variant.key]: prev[variant.key] === value ? '' : value,
                      }))
                    }
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          <div className="mb-4">
            <Typography variant="subtitle2" className="mb-2 font-medium text-gray-700">
              Quantity (Max: {product.currentQuantity})
            </Typography>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              fullWidth
              error={!!error}
              inputProps={{ min: 1, max: product.currentQuantity }}
            />
            {error && (
              <Typography color="error" variant="caption" className="mt-1 block">
                {error}
              </Typography>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outlined" onClick={() => setIsModalOpen(false)} fullWidth>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={quantity === 0}
              fullWidth
            >
              Confirm
            </Button>
          </div>
        </Box>
      </Modal>
    </motion.div>
  );
};

export default ProductCard;
