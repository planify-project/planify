const services = require('../../server/seeds/services');

class ServicesController {
  static async getAllServices(req, res) {
    try {
      res.status(200).json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch services'
      });
    }
  }

  static async getServiceById(req, res) {
    try {
      const { id } = req.params;
      const service = services.find(s => s.id === parseInt(id));
      
      if (!service) {
        return res.status(404).json({
          success: false,
          error: 'Service not found'
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
        error: 'Failed to fetch service'
      });
    }
  }
}

module.exports = ServicesController; 