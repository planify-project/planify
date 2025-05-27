const express = require('express');
const router = express.Router();
const ServicesController = require('../controllers/servicesController');

// GET /api/services
router.get('/', ServicesController.getAllServices);

// GET /api/services/provider/:providerId
router.get('/provider/:providerId', ServicesController.getServicesByProvider);

// GET /api/services/:id
router.get('/:id', ServicesController.getServiceById);

// POST /api/services
router.post('/', (req, res, next) => {
  // Only use multer if there's a file in the request
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    ServicesController.upload(req, res, next);
  } else {
    next();
  }
}, ServicesController.createService);

// PUT /api/services/:id
router.put('/:id', ServicesController.upload, ServicesController.updateService);

// DELETE /api/services/:id
router.delete('/:id', ServicesController.deleteService);

module.exports = router;
