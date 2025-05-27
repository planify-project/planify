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

async function seedRecentPayments() {
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

    // Calculate date ranges for current month and last month
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    console.log('Date ranges:', {
      currentMonthStart: currentMonthStart.toISOString(),
      currentMonthEnd: currentMonthEnd.toISOString(),
      lastMonthStart: lastMonthStart.toISOString(),
      lastMonthEnd: lastMonthEnd.toISOString()
    });

    const payments = [];

    // Create 60 payments for current month
    for (let i = 0; i < 60; i++) {
      const user = faker.helpers.arrayElement(users);
      const event = events.length ? faker.helpers.arrayElement(events) : null;
      const service = services.length ? faker.helpers.arrayElement(services) : null;
      const amount = faker.finance.amount(100, 1000, 2);
      const createdAt = faker.date.between({ 
        from: currentMonthStart, 
        to: currentMonthEnd 
      });
      const status = faker.helpers.arrayElement(['completed', 'pending', 'failed']);
      const payment_intent_id = faker.string.uuid();

      payments.push({
        user_id: user.id,
        event_id: event ? event.id : null,
        service_id: service ? service.id : null,
        amount,
        method: 'transfer',
        status,
        payment_intent_id,
        createdAt,
        createdAt,
      });
    }

    // Create 40 payments for last month
    for (let i = 0; i < 40; i++) {
      const user = faker.helpers.arrayElement(users);
      const event = events.length ? faker.helpers.arrayElement(events) : null;
      const service = services.length ? faker.helpers.arrayElement(services) : null;
      const amount = faker.finance.amount(100, 1000, 2);
      const createdAt = faker.date.between({ 
        from: lastMonthStart, 
        to: lastMonthEnd 
      });
      const status = faker.helpers.arrayElement(['completed', 'pending', 'failed']);
      const payment_intent_id = faker.string.uuid();

      payments.push({
        user_id: user.id,
        event_id: event ? event.id : null,
        service_id: service ? service.id : null,
        amount,
        method: 'transfer',
        status,
        payment_intent_id,
        createdAt,
        createdAt,
      });
    }

    // Clear existing payments first
    await Payment.destroy({
      where: {
        created_at: {
          [Sequelize.Op.between]: [lastMonthStart, currentMonthEnd]
        }
      }
    });

    // Create new payments
    await Payment.bulkCreate(payments);
    console.log('🎉 Payments seeded successfully:');
    console.log(`- Current month: 60 payments`);
    console.log(`- Last month: 40 payments`);
    console.log(`- Total: ${payments.length} payments`);

  } catch (error) {
    console.error('❌ Failed to seed recent payments:', error);
  } finally {
    await sequelize.close();
  }
}

seedRecentPayments(); 