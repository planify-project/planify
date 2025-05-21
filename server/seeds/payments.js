// filepath: server/seeds/payments.js
const { Sequelize } = require('sequelize');
const PaymentModel = require('../models/payment');
const UserModel = require('../models/user');
const EventModel = require('../models/event');
const ServiceModel = require('../models/service');
const { faker } = require('@faker-js/faker');

// Initialize Sequelize
const sequelize = new Sequelize('planify', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

const Payment = PaymentModel(sequelize, Sequelize.DataTypes);
const User = UserModel(sequelize, Sequelize.DataTypes);
const Event = EventModel(sequelize, Sequelize.DataTypes);
const Service = ServiceModel(sequelize, Sequelize.DataTypes);

async function seedPayments() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to DB');

    // Fetch users, events, and services
    const users = await User.findAll({ attributes: ['id'] });
    const events = await Event.findAll({ attributes: ['id'] });
    const services = await Service.findAll({ attributes: ['id'] });

    if (!users.length) {
      console.error('❌ No users found. Seed users first.');
      return;
    }

    const payments = [];
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(users);
      const event = events.length ? faker.helpers.arrayElement(events) : null;
      const service = services.length ? faker.helpers.arrayElement(services) : null;
      const amount = faker.finance.amount(10, 500, 2);
      const method = faker.helpers.arrayElement(['cash', 'transfer']);
      const status = faker.helpers.arrayElement(['pending', 'completed', 'failed']);
      const createdAt = faker.date.between({ from: '2023-01-01', to: new Date() });
      const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

      payments.push({
        user_id: user.id,
        event_id: event ? event.id : null,
        service_id: service ? service.id : null,
        amount,
        method,
        status,
        created_at: createdAt,
        updated_at: updatedAt,
      });
    }

    await Payment.bulkCreate(payments);
    console.log('🎉 50 payments seeded successfully.');
  } catch (error) {
    console.error('❌ Failed to seed payments:', error);
  } finally {
    await sequelize.close();
  }
}

seedPayments();
