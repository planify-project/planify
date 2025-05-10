'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        id: uuidv4(),
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        phone: '+216 22 333 444',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'provider',
        phone: '+216 55 666 777',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        phone: '+216 33 444 555',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'provider',
        phone: '+216 44 555 666',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'David Brown',
        email: 'david@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        phone: '+216 66 777 888',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Emma Davis',
        email: 'emma@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'provider',
        phone: '+216 77 888 999',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'James Wilson',
        email: 'james@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        phone: '+216 88 999 000',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Lisa Anderson',
        email: 'lisa@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'provider',
        phone: '+216 99 000 111',
        avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Tom Harris',
        email: 'tom@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        phone: '+216 11 222 333',
        avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Rachel Green',
        email: 'rachel@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'provider',
        phone: '+216 12 333 444',
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
}; 