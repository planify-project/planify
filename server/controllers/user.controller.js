const { User } = require('../database');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
};

// Create a new user from Firebase auth
exports.createUserFromFirebase = async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;
    console.log('Creating/updating user from Firebase:', { uid, email, displayName });

    if (!uid || !email) {
      return res.status(400).json({
        success: false,
        message: 'Firebase UID and email are required'
      });
    }

    // Check if user already exists by Firebase UID
    let user = await User.findOne({ where: { firebase_uid: uid } });
    
    if (!user) {
      // Check if user exists by email
      user = await User.findOne({ where: { email } });
      
      if (user) {
        // Update existing user with Firebase UID
        console.log('Updating existing user with Firebase UID:', user.id);
        await user.update({ 
          firebase_uid: uid,
          name: displayName || user.name
        });
      } else {
        // Create new user
        console.log('Creating new user with Firebase UID');
        user = await User.create({
          name: displayName || email.split('@')[0],
          email,
          firebase_uid: uid,
          password: null // No password needed for Firebase auth
        });
      }
    }

    console.log('User created/updated successfully:', user.id);
    
    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error creating/updating user from Firebase:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to create/update user', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const { name, photoURL } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedData = {
      name: name || user.name,
      photoURL: photoURL || user.photoURL
    };

    await user.update(updatedData);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update user', 
      details: error.message 
    });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};