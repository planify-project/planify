const express = require('express');
const router = express.Router();
const ServicesController = require('../controllers/servicesController');

// GET /api/services
router.get('/', ServicesController.getAllServices);

// GET /api/services/:id
router.get('/:id', ServicesController.getServiceById);

// POST /api/services
router.post('/', ServicesController.upload, ServicesController.createService);

// PUT /api/services/:id
router.put('/:id', ServicesController.upload, ServicesController.updateService);

// DELETE /api/services/:id
router.delete('/:id', ServicesController.deleteService);

module.exports = router;
