const { faker } = require('@faker-js/faker');
const { Sequelize } = require('sequelize');
const ServiceModel = require('../models/service');
const UserModel = require('../models/user');

// Initialize Sequelize
const sequelize = new Sequelize('planify', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define models
const Service = ServiceModel(sequelize, Sequelize.DataTypes);
const User = UserModel(sequelize, Sequelize.DataTypes);

async function seedServices() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to DB');

    // Get providers only
    const users = await User.findAll({
      where: { isProvider: true },
      attributes: ['id']
    });

    if (users.length === 0) {
      console.error('❌ No providers found. Make sure to seed users with isProvider=true');
      return;
    }

    const services = [];

    for (let i = 0; i < 100; i++) {
      const createdAt = faker.date.between({ from: '2023-01-01', to: new Date() });
      const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

      services.push({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 10, max: 1000 }),
        serviceType: faker.helpers.arrayElement(['general', 'catering', 'lighting', 'security']),
        imageUrl: faker.image.url(),
        provider_id: faker.helpers.arrayElement(users).id,
        category_id: null, // Or generate logic for real categories
        createdAt,
        updatedAt
      });
    }

    await Service.bulkCreate(services);
    console.log('🎉 100 services seeded successfully.');
  } catch (err) {
    console.error('❌ Failed to seed services:', err);
  } finally {
    await sequelize.close();
  }
}

seedServices();