const { Service, User } = require('../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for image storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'services');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'));
    }
  }
}).single('image');

// Wrap the upload middleware to handle errors
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

class ServicesController {
  static async getAllServices(req, res) {
    try {
      console.log('Getting all services...');
      const { type } = req.query;
      let query = {};
      
      if (type) {
        query.service_type = type.toLowerCase();
      }

      const services = await Service.findAll({
        where: query,
        include: [{
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email']
        }],
        attributes: [
          'id', 
          'title', 
          'description', 
          'price', 
          'service_type', 
          'imageUrl', 
          'provider_id', 
          'location',
          'is_active',
          'created_at', 
          'updated_at'
        ]
      });

      console.log(`Found ${services.length} services`);
      console.log('First service data:', services[0]?.toJSON());
      res.status(200).json(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch services',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getServiceById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Service ID is required'
        });
      }

      const service = await Service.findByPk(id, {
        include: [{
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email']
        }]
      });

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.status(200).json({
        success: true,
        data: service
      });
    } catch (error) {
      console.error('Error fetching service:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async createService(req, res) {
    try {
      const { title, description, price, provider_id, image } = req.body;
      
      // Validate required fields
      if (!title || !description || !price) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      // Verify provider exists
      const provider = await User.findByPk(provider_id);
      if (!provider) {
        return res.status(404).json({
          success: false,
          message: 'Provider not found'
        });
      }

      // Get image URL from either uploaded file or Cloudinary URL
      let imageUrl = null;
      if (req.file) {
        // If file was uploaded through multer
        imageUrl = `/uploads/services/${req.file.filename}`;
      } else if (image) {
        // If Cloudinary URL was provided
        imageUrl = image;
      }

      console.log('Creating service with data:', {
        title,
        description,
        price,
        imageUrl,
        provider_id
      });

      const service = await Service.create({
        title,
        description,
        price,
        imageUrl,
        provider_id,
        is_active: true
      });

      console.log('Created service:', service.toJSON());

      res.status(201).json({
        success: true,
        data: service
      });
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateService(req, res) {
    try {
      const { id } = req.params;
      const { title, description, price, serviceType, provider_id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Service ID is required'
        });
      }

      const service = await Service.findByPk(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      // If provider_id is provided, verify it exists
      if (provider_id) {
        const provider = await User.findByPk(provider_id);
        if (!provider) {
          return res.status(404).json({
            success: false,
            message: 'Provider not found'
          });
        }
      }

      // Handle image update
      let imageUrl = service.imageUrl;
      if (req.file) {
        // Delete old image if it exists
        if (service.imageUrl) {
          const oldImagePath = path.join(__dirname, '..', service.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        imageUrl = `/uploads/services/${req.file.filename}`;
      }

      console.log('Updating service with data:', {
        title,
        description,
        price,
        imageUrl,
        serviceType,
        provider_id
      });

      await service.update({
        title,
        description,
        price,
        imageUrl,
        serviceType,
        provider_id
      });

      console.log('Updated service:', service.toJSON());

      res.status(200).json({
        success: true,
        data: service
      });
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteService(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Service ID is required'
        });
      }

      const service = await Service.findByPk(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      // Delete the image file if it exists
      if (service.imageUrl) {
        const imagePath = path.join(__dirname, '..', service.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await service.destroy();

      res.status(200).json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getServicesByProvider(req, res) {
    try {
      const { providerId } = req.params;
      
      if (!providerId) {
        return res.status(400).json({
          success: false,
          message: 'Provider ID is required'
        });
      }

      const services = await Service.findAll({
        where: { provider_id: providerId },
        include: [{
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email']
        }],
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json(services);
    } catch (error) {
      console.error('Error fetching provider services:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch provider services',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = {
  upload: uploadMiddleware,
  getAllServices: ServicesController.getAllServices,
  getServiceById: ServicesController.getServiceById,
  createService: ServicesController.createService,
  updateService: ServicesController.updateService,
  deleteService: ServicesController.deleteService,
  getServicesByProvider: ServicesController.getServicesByProvider,
  getServices: async (req, res) => {
    try {
      const { serviceType } = req.query;
      console.log('Fetching services with type:', serviceType);

      const services = await Service.findAll({
        where: serviceType ? { serviceType } : {},
        order: [['createdAt', 'DESC']]
      });

      console.log(`Found ${services.length} services`);
      res.json(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch services',
        error: error.message
      });
    }
  }
};