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
import {
  ShoppingBag as ShoppingBagIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Inventory as InventoryIcon,
  CalendarToday as CalendarTodayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useStore } from '../../store/store';
import { useRoutes } from '../../hooks/useRoutes';

// --- Wishlist management ---
const getWishlist = () => JSON.parse(localStorage.getItem('customerWishlist') || '[]');
const saveWishlist = (w) => localStorage.setItem('customerWishlist', JSON.stringify(w));

const addToWishlist = (id) => {
  const w = getWishlist();
  if (!w.includes(id)) {
    w.push(id);
    saveWishlist(w);
  }
};

const removeFromWishlist = (id) => {
  const w = getWishlist().filter((i) => i !== id);
  saveWishlist(w);
};

// --- Component ---
const ProductCard = ({ product }) => {
  const { selectedProducts, selectProduct, removeSelectedProduct } = useStore();
  const { getRoute } = useRoutes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [isInCart, setIsInCart] = useState(false);
  const [error, setError] = useState('');
  const [isInWishlist, setIsInWishlist] = useState(false);

  const productId = product.itemId || product.id;

  const formatNumber = (num) =>
    num % 1 === 0 ? num.toString() : (Number(num) || 0).toFixed(2);

  useEffect(() => {
    const wishlist = getWishlist();
    setIsInWishlist(wishlist.includes(productId));
  }, [productId]);

  useEffect(() => {
    const selected = selectedProducts[product.itemId];
    setIsInCart(!!selected);
    if (selected) {
      setQuantity(selected.quantity || 1);
      setSelectedVariants(selected);
    } else {
      setQuantity(1);
      setSelectedVariants({});
    }
  }, [selectedProducts, product.itemId]);

  const handleConfirm = () => {
    if (quantity <= 0) return setError('Quantity must be greater than zero');
    setError('');
    selectProduct(product, { ...selectedVariants, quantity });
    setIsModalOpen(false);
    setIsInCart(true);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
    setIsInWishlist(!isInWishlist);
  };

  const handleRemove = () => {
    removeSelectedProduct(product.itemId);
    setIsInCart(false);
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
            {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
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
              <InventoryIcon className="text-gray-500" />
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
              <CalendarTodayIcon className="text-gray-500" />
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
              <InfoIcon fontSize="small" /> Product Info
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
              startIcon={<ShoppingBagIcon />}
              onClick={() => setIsModalOpen(true)}
              fullWidth
              sx={{ textTransform: 'none', borderRadius: '10px', py: 1.2 }}
            >
              {isInCart ? 'Update Cart' : 'Add to Cart'}
            </Button>
            {isInCart && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
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
