const { faker } = require('@faker-js/faker');
const { Sequelize } = require('sequelize');
const EventSpaceModel = require('../models/eventSpace');

// DB connection
const sequelize = new Sequelize('planify', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

const EventSpace = EventSpaceModel(sequelize, Sequelize.DataTypes);

async function seedEventSpaces() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    const eventSpaces = [];

    for (let i = 0; i < 100; i++) {
      const createdAt = faker.date.between({ from: '2023-01-01', to: new Date() });
      const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

      eventSpaces.push({
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        location: `${faker.location.city()}, ${faker.location.country()}`,
        capacity: faker.number.int({ min: 20, max: 500 }),
        price: faker.commerce.price({ min: 500, max: 5000 }),
        amenities: faker.helpers.arrayElements(['WiFi', 'Parking', 'Restrooms', 'Projector', 'Sound System'], 3),
        images: [faker.image.url(), faker.image.url()],
        availability: {
          days: ['Monday', 'Wednesday', 'Friday'],
          hours: '09:00-18:00'
        },
        isActive: faker.datatype.boolean(),
        createdAt,
        updatedAt
      });
    }

    await EventSpace.bulkCreate(eventSpaces);
    console.log('🎉 100 event spaces seeded successfully');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await sequelize.close();
  }
}

seedEventSpaces();
