'use strict';
const { v4: uuidv4 } = require('uuid');
const { Service } = require('../database');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const services = [
      {
        id: '1',
        title: 'Professional Photography',
        description: 'Expert event photography service',
        price: 500,
        serviceType: 'service',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
        provider_id: 1
      },
      {
        id: '2',
        title: 'Catering Service',
        description: 'Premium catering for all events',
        price: 1000,
        serviceType: 'service',
        imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033',
        provider_id: 1
      }
    ];

    await Service.destroy({ where: {} });
    console.log('Cleared existing services');
    
    const createdServices = await Service.bulkCreate(services);
    console.log(`Seeded ${createdServices.length} services`);
    
    return createdServices;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('services', null, {});
  }
};