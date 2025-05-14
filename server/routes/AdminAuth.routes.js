const express = require('express');
const router = express.Router();
const { Login, register, updateUser} = require('../controllers/AdminAuth.controller');

// Route to register a new user
router.post('/register', register);
// Route to log in an existing user
router.post('/login', Login);
// Route to update a user's profile
router.put('/updatep-rofile', updateUser);

module.exports = router;