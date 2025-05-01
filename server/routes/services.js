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

module.exports = router; 