// controllers/servicesController.js
const { Service, ServiceCategory } = require('../database');

class ServicesController {
  static async getAllServices(req, res) {
    try {
      const { type } = req.query;
      let query = {};
      
      if (type) {
        query.type = type;
      }

      console.log('Query:', query); // Log the query for debugging

      const services = await Service.findAll({
        where: query,
        include: [
          { model: ServiceCategory, as: 'service_category' }  // Update alias to match association
        ]
      });
      
      res.status(200).json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        stack: error.stack // Include stack trace for debugging
      });
    }
  }

  static async getServiceById(req, res) {
    try {
      const service = await Service.findByPk(req.params.id, {
        include: [
          { model: ServiceCategory, as: 'category' }  // Include category info
        ]
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
      // Find the "equipment" category
      const category = await ServiceCategory.findOne({ where: { name: 'equipment' } });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const service = await Service.create({
        provider_id: req.body.provider_id,
        category_id: category.id,  // Use the "equipment" category
        type: req.body.type,
        description: req.body.description,
        price: req.body.price,
      });

      res.status(201).json({
        success: true,
        data: service,
        message: 'Service created successfully'
      });
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ServicesController;
