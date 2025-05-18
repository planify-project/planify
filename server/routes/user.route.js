const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Routes
router.get('/getAll', userController.getAllUsers); // Get all users
router.get('/:id', userController.getUserById); // Get a user by ID
router.get('/firebase/:uid', userController.getUserByFirebaseUid); // Get a user by Firebase UID
router.post('/add', userController.createUser); // Create a new user
router.post('/firebase', userController.createUserFromFirebase);
router.put('/:id', userController.updateUser); // Update a user by ID
router.delete('/:id', userController.deleteUser); // Delete a user by ID

module.exports = router;