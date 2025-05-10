const express = require('express');
const router = express.Router();
const ServicesController = require('../controllers/servicesController');

// Middleware for validating service ID
const validateServiceId = (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid service ID'
    });
  }
  next();
};

// Routes
router.get('/', ServicesController.getAllServices);
router.get('/:id', validateServiceId, ServicesController.getServiceById);
router.post('/', ServicesController.createService);
router.put('/:id', validateServiceId, ServicesController.updateService);
router.delete('/:id', validateServiceId, ServicesController.deleteService);

// 💡 New routes to get services by category
router.get('/category/equipment', ServicesController.getServicesByEquipment);
router.get('/category/event-space', ServicesController.getServicesByEventSpace);
router.get('/category/services', ServicesController.getServicesByServices);

module.exports = router;
