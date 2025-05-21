const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Routes
router.put('/ban/:id', userController.banUser);
router.get('/getAll', userController.getAllUsers); // Get all users
router.get('/totalusers', userController.getTotalUsers); // Get total users count
router.get('/:id', userController.getUserById); // Get a user by ID
router.get('/firebase/:uid', userController.getUserByFirebaseUid); // Get a user by Firebase UID
router.post('/add', userController.createUser); // Create a new user
router.post('/firebase', userController.createUserFromFirebase);
router.put('/:id', userController.updateUser); // Update a user by ID
router.delete('/delete/:id', userController.deleteUser); // Delete a user by ID
router.get('/traffic/monthly', userController.getUserTrafficByMonth);


module.exports = router;