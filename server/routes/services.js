const express = require('express');
const router = express.Router();
const ServicesController = require('../controllers/servicesController');

// Get all services
router.get('/', ServicesController.getAllServices);

// Get service by ID
router.get('/:id', ServicesController.getServiceById);

// Create new service (with image upload)
router.post('/', 
  ServicesController.upload,
  ServicesController.createService
);

// Update service (with image upload)
router.put('/:id',
  ServicesController.upload,
  ServicesController.updateService
);

// Delete service
router.delete('/:id',
  ServicesController.deleteService
);

module.exports = router;