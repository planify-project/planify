// filepath: server/seeds/messages.js
const { Sequelize } = require('sequelize');
const MessageModel = require('../models/message');
const UserModel = require('../models/user');
const { faker } = require('@faker-js/faker');

// Initialize Sequelize
const sequelize = new Sequelize('planify', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

const Message = MessageModel(sequelize, Sequelize.DataTypes);
const User = UserModel(sequelize, Sequelize.DataTypes);

async function seedMessages() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to DB');

    const users = await User.findAll({ attributes: ['id'] });

    if (users.length < 2) {
      console.error('❌ Need at least 2 users to seed messages. Seed users first.');
      return;
    }

    const messages = [];

    for (let i = 0; i < 100; i++) {
      let sender = faker.helpers.arrayElement(users);
      let receiver = faker.helpers.arrayElement(users);

      // Ensure sender and receiver aren't the same
      while (receiver.id === sender.id) {
        receiver = faker.helpers.arrayElement(users);
      }

      messages.push({
        roomId: faker.string.uuid(),
        senderId: sender.id,
        receiverId: receiver.id,
        text: faker.lorem.sentences(2),
        timestamp: faker.date.recent(30)
      });
    }

    await Message.bulkCreate(messages);
    console.log('📨 100 messages seeded successfully.');
  } catch (error) {
    console.error('❌ Failed to seed messages:', error);
  } finally {
    await sequelize.close();
  }
}

seedMessages();
