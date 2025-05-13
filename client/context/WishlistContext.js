import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../configs/api';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/wishlist');
      console.log('Wishlist response:', response.data);
      setWishlistItems(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError(error.message || 'Error fetching wishlist');
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlistItem = async (itemId, itemType) => {
    try {
      setError(null);
      
      // Validate itemId
      if (!itemId) {
        console.error('Invalid item ID:', itemId);
        setError('Invalid item ID');
        return;
      }

      // Don't parse string IDs to integers
      const isInWishlist = wishlistItems.some(item => item.item_id === itemId);
      console.log('Toggling wishlist item:', { itemId, itemType, isInWishlist });

      if (isInWishlist) {
        // Remove from wishlist
        console.log('Removing from wishlist');
        await api.delete(`/wishlist/${itemId}`);
        setWishlistItems(prev => prev.filter(item => item.item_id !== itemId));
      } else {
        // Add to wishlist
        const data = {
          item_id: itemId,
          item_type: itemType || 'event'
        };
        console.log('Adding to wishlist with data:', data);
        const response = await api.post('/wishlist', data);
        console.log('Add to wishlist response:', response.data);
        setWishlistItems(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.message || 'Error updating wishlist');
      } else {
        setError(error.message || 'Error updating wishlist');
      }
    }
  };

  const isInWishlist = (itemId) => {
    return wishlistItems.some(item => item.item_id === itemId);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const value = {
    wishlistItems,
    loading,
    error,
    toggleWishlistItem,
    isInWishlist,
    refreshWishlist: fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}; 