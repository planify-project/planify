const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const serviceController = require('../controllers/serviceController');

// Create a new service
router.post('/', 
  authenticateToken,
  serviceController.upload.single('image'),
  serviceController.createService
);

// Get all services for the logged-in agent
router.get('/my-services', 
  authenticateToken,
  serviceController.getAgentServices
);

// Update a service
router.put('/:id',
  authenticateToken,
  serviceController.upload.single('image'),
  serviceController.updateService
);

// Delete a service
router.delete('/:id',
  authenticateToken,
  serviceController.deleteService
);

module.exports = router; 