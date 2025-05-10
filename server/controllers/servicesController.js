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
        stack: error.stack
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
      const category = await ServiceCategory.findOne({ where: { name: 'equipment' } });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const service = await Service.create({
        provider_id: req.body.provider_id,
        category_id: category.id,
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

  static async updateService(req, res) {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      await service.update(req.body);
      res.status(200).json({ success: true, data: service, message: 'Service updated successfully' });
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteService(req, res) {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      await service.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ✅ New methods to fetch services by category
  static async getServicesByCategoryName(req, res, categoryName) {
    try {
      const category = await ServiceCategory.findOne({ where: { name: categoryName } });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      const services = await Service.findAll({
        where: { category_id: category.id },
        include: [{ model: ServiceCategory, as: 'service_category' }]
      });

      res.status(200).json({ success: true, data: services });
    } catch (error) {
      console.error(`Error fetching ${categoryName} services:`, error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static getServicesByEquipment(req, res) {
    return this.getServicesByCategoryName(req, res, 'equipment');
  }

  static getServicesByEventSpace(req, res) {
    return this.getServicesByCategoryName(req, res, 'event space');
  }

  static getServicesByServices(req, res) {
    return this.getServicesByCategoryName(req, res, 'services');
  }
}

module.exports = ServicesController;
