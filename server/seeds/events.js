const { faker } = require('@faker-js/faker');
const { Sequelize } = require('sequelize');
const EventModel = require('../models/event');
const UserModel = require('../models/user');

// Initialize Sequelize
const sequelize = new Sequelize('planify', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define models
const Event = EventModel(sequelize, Sequelize.DataTypes);
const User = UserModel(sequelize, Sequelize.DataTypes);

async function seedEvents() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to DB');

    const users = await User.findAll({ attributes: ['id'] });
    if (users.length === 0) {
      console.error('❌ No users found. Seed users first.');
      return;
    }

    const events = [];
    for (let i = 0; i < 100; i++) {
      const createdAt = faker.date.between({ from: '2023-01-01T00:00:00Z', to: new Date() });
      const startDate = faker.date.between({ from: createdAt, to: new Date() });
      const endDate = faker.date.between({ from: startDate, to: new Date() });

      const randomUser = faker.helpers.arrayElement(users);

      events.push({
        id: faker.string.uuid(),
        name: faker.lorem.words(3),
        description: faker.lorem.sentences(),
        type: faker.helpers.arrayElement(['wedding', 'meeting', 'party', 'conference']),
        startDate,
        endDate,
        location: faker.location.streetAddress(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        isPublic: faker.datatype.boolean(),
        status: faker.helpers.arrayElement(['pending', 'approved', 'rejected', 'cancelled', 'completed']),
        maxParticipants: faker.number.int({ min: 10, max: 200 }),
        ticketPrice: faker.commerce.price({ min: 0, max: 100 }),
        coverImage: faker.image.url(),
        created_by: randomUser.id,
        agent_id: null,
        attendees_count: faker.number.int({ min: 0, max: 100 }),
        available_spots: faker.number.int({ min: 0, max: 100 }),
        budget: faker.commerce.price({ min: 500, max: 10000 }),
        is_free: faker.datatype.boolean(),
        createdAt,
        updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
      });
    }

    await Event.bulkCreate(events);
    console.log('🎉 100 events seeded successfully.');
  } catch (error) {
    console.error('❌ Failed to seed events:', error);
  } finally {
    await sequelize.close();
  }
}

seedEvents();
