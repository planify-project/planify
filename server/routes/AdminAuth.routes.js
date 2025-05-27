const express = require('express');
const router = express.Router();
const { Login, register, updateUser, socialLogin} = require('../controllers/AdminAuth.controller');

console.log('Setting up AdminAuth routes...');

// Route to register a new user
router.post('/register', register);
// Route to log in an existing user
router.post('/login', Login);
// Route to update a user's profile
router.put('/update-profile', updateUser);
console.log('Update profile route registered at PUT /update-profile');

router.post("/social-login", socialLogin);

module.exports = router;