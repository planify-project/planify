const { Service } = require('../database');

class ServicesController {
  static async getAllServices(req, res) {
    try {
      const { type } = req.query;
      let query = {};
      
      if (type) {
        query.type = type;
      }

      const services = await Service.findAll({
        where: query
      });
      
      res.status(200).json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getServiceById(req, res) {
    try {
      const service = await Service.findByPk(req.params.id);
      
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
      const service = await Service.create(req.body);
      
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