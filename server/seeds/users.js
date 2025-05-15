const { faker } = require('@faker-js/faker');
const { Sequelize } = require('sequelize');
const UserModel = require('../models/user'); // <-- Add this line

// Initialize Sequelize
const sequelize = new Sequelize('planify', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql', // or 'postgres'
});

// Define the model
const Users = UserModel(sequelize, Sequelize.DataTypes);

// Seed users
async function seedUsers() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const users = [];

    for (let i = 0; i < 100; i++) {
      users.push({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        contact_details: {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
        },
        password: faker.internet.password(),
        isBanned: faker.datatype.boolean(),
        isProvider: faker.datatype.boolean(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await Users.bulkCreate(users);
    console.log('✅ 100 users seeded successfully.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
}

seedUsers();
