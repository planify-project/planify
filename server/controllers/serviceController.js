const { Service } = require('../models');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'planify/services',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage: storage });

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { title, description, price, serviceType } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    
    const service = await Service.create({
      title,
      description,
      price,
      serviceType,
      imageUrl,
      agentId: req.user.id
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all services for the logged-in agent
exports.getAgentServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { agentId: req.user.id }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, serviceType } = req.body;
    const imageUrl = req.file ? req.file.path : undefined;

    const service = await Service.findOne({
      where: { id, agentId: req.user.id }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await service.update({
      title,
      description,
      price,
      serviceType,
      ...(imageUrl && { imageUrl })
    });

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findOne({
      where: { id, agentId: req.user.id }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (service.imageUrl) {
      const publicId = service.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`planify/services/${publicId}`);
    }

    await service.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  upload,
  createService: exports.createService,
  getAgentServices: exports.getAgentServices,
  updateService: exports.updateService,
  deleteService: exports.deleteService
}; 