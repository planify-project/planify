import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../configs/api';

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
      console.log('Fetching wishlist...');
      const response = await api.get('/wishlist');
      console.log('Wishlist response:', response.data);
      
      if (response.data.success) {
        setWishlistItems(response.data.data || []);
      } else {
        setWishlistItems([]);
        console.error('Failed to fetch wishlist:', response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError(error.response?.data?.message || error.message || 'Error fetching wishlist');
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlistItem = async (itemId, itemType) => {
    try {
      setError(null);
      
      if (!itemId) {
        console.error('Invalid item ID:', itemId);
        setError('Invalid item ID');
        return;
      }

      // Convert itemId to string for comparison
      const stringItemId = String(itemId);
      const isInWishlist = wishlistItems.some(item => String(item.item_id) === stringItemId);
      console.log('Toggling wishlist item:', { itemId: stringItemId, itemType, isInWishlist });

      if (isInWishlist) {
        console.log('Removing from wishlist:', stringItemId);
        const response = await api.delete(`/wishlist/${stringItemId}`);
        if (response.data.success) {
          setWishlistItems(prev => prev.filter(item => String(item.item_id) !== stringItemId));
        } else {
          throw new Error(response.data.message || 'Failed to remove from wishlist');
        }
      } else {
        const data = {
          item_id: stringItemId,
          item_type: itemType || 'event'
        };
        console.log('Adding to wishlist with data:', data);
        const response = await api.post('/wishlist', data);
        console.log('Add to wishlist response:', response.data);
        
        if (response.data.success) {
          setWishlistItems(prev => [...prev, response.data.data]);
        } else {
          throw new Error(response.data.message || 'Failed to add to wishlist');
        }
      }

      // Refresh the wishlist after any change
      await fetchWishlist();
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      setError(error.response?.data?.message || error.message || 'Error updating wishlist');
    }
  };

  const isInWishlist = (itemId) => {
    if (!itemId) return false;
    return wishlistItems.some(item => String(item.item_id) === String(itemId));
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