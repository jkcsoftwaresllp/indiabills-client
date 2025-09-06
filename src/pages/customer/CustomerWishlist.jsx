import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageAnimate from '../../components/Animate/PageAnimate';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useStore } from '../../store/store';
import { getProducts } from '../../network/api';

const getWishlist = () => {
  const wishlist = localStorage.getItem('customerWishlist');
  return wishlist ? JSON.parse(wishlist) : [];
};

const saveWishlist = (wishlist) => {
  localStorage.setItem('customerWishlist', JSON.stringify(wishlist));
};

const CustomerWishlist = () => {
  const navigate = useNavigate();
  const { selectProduct, successPopup } = useStore();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const wishlist = getWishlist();
        const allProducts = await getProducts();
        
        const wishlistProducts = allProducts.filter(product => 
          wishlist.includes(product.id)
        );
        
        setWishlistItems(wishlist);
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, []);

  const handleRemoveFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(id => id !== productId);
    setWishlistItems(updatedWishlist);
    saveWishlist(updatedWishlist);
    setProducts(prev => prev.filter(product => product.id !== productId));
    successPopup('Removed from wishlist');
  };

  const handleAddToCart = (product) => {
    selectProduct(product, { quantity: 1 });
    successPopup('Added to cart');
  };

  const handleMoveAllToCart = () => {
    products.forEach(product => {
      selectProduct(product, { quantity: 1 });
    });
    successPopup(`Added ${products.length} items to cart`);
    navigate('/customer/cart');
  };

  if (loading) {
    return (
      <PageAnimate>
        <div className="flex justify-center items-center h-64">
          <Typography>Loading wishlist...</Typography>
        </div>
      </PageAnimate>
    );
  }

  return (
    <PageAnimate>
      <div className="w-full p-6">
        <div className="mb-6 p-6 bg-pink-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {products.length} items saved for later
              </p>
            </div>
            {products.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                onClick={handleMoveAllToCart}
              >
                Move All to Cart
              </Button>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Your wishlist is empty
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              Browse our products and add items you love to your wishlist
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/customer')}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card className="h-full">
                  <CardContent>
                    <div className="flex justify-between items-start mb-3">
                      <Typography variant="h6" className="font-bold capitalize">
                        {product.name}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                    
                    <Typography variant="body2" color="textSecondary" className="mb-2">
                      {product.manufacturer}
                    </Typography>
                    
                    <Typography variant="h6" className="text-green-600 font-bold mb-3">
                      ₹{product.salePrice}
                    </Typography>

                    <div className="mb-3">
                      <Chip 
                        label={product.isActive ? 'Available' : 'Out of Stock'} 
                        color={product.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </div>

                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
                      fullWidth
                      disabled={!product.isActive}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </PageAnimate>
  );
};

export default CustomerWishlist;