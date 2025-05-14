const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');

// Get all wishlist items
router.get('/', wishlistController.getWishlist);

// Add item to wishlist
router.post('/', wishlistController.addToWishlist);

// Remove item from wishlist
router.delete('/:itemId', wishlistController.removeFromWishlist);

module.exports = router; 