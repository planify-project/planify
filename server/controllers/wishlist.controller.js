const db = require('../database');
const { Wishlist, WishlistItem } = db;

// Get all wishlist items
exports.getWishlist = async (req, res) => {
  try {
    console.log('Getting all wishlist items');
    const wishlistItems = await WishlistItem.findAll({
      include: [
        {
          model: Wishlist,
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']] // Sort by newest first
    });
    console.log('Found wishlist items:', wishlistItems.length);
    res.json(wishlistItems);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { item_id, item_type } = req.body;
    console.log('Adding to wishlist:', { item_id, item_type });

    if (!item_id || !item_type) {
      console.error('Missing required fields:', { received: req.body });
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: req.body
      });
    }

    // Create or get default wishlist
    const [wishlist] = await Wishlist.findOrCreate({
      where: { name: 'Default Wishlist' },
      defaults: { 
        name: 'Default Wishlist',
        user_id: null
      }
    });

    // Check if item already exists in wishlist
    const existingItem = await WishlistItem.findOne({
      where: {
        wishlist_id: wishlist.id,
        item_id: item_id,
        item_type: item_type
      }
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    // Add item to wishlist
    const wishlistItem = await WishlistItem.create({
      wishlist_id: wishlist.id,
      item_id: item_id,
      item_type: item_type
    });

    // Fetch the complete wishlist item with its associated wishlist
    const completeWishlistItem = await WishlistItem.findOne({
      where: { 
        wishlist_id: wishlist.id,
        item_id: item_id,
        item_type: item_type
      },
      include: [
        {
          model: Wishlist,
          attributes: ['name']
        }
      ]
    });

    console.log('Added to wishlist:', completeWishlistItem);
    res.status(201).json(completeWishlistItem);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log('Removing from wishlist:', itemId);

    const deleted = await WishlistItem.destroy({
      where: { item_id: itemId }
    });

    if (deleted) {
      console.log('Successfully removed from wishlist');
      res.json({ message: 'Item removed from wishlist' });
    } else {
      console.log('Item not found in wishlist');
      res.status(404).json({ message: 'Item not found in wishlist' });
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: error.message });
  }
};
