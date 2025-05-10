'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const services = [
      {
        id: uuidv4(),
        title: 'Wedding Photography',
        description: 'Professional wedding photography services with high-quality equipment and experienced photographers.',
        price: 500,
        category: 'Photography',
        duration: '8 hours',
        availability: 'Weekends',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552',
        created_by: 'demo-user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        title: 'Event Catering',
        description: 'Full-service catering for events of all sizes. Custom menus available.',
        price: 25,
        category: 'Catering',
        duration: 'Per person',
        availability: 'All week',
        imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033',
        created_by: 'demo-user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        title: 'DJ Services',
        description: 'Professional DJ services with state-of-the-art equipment and extensive music library.',
        price: 300,
        category: 'Entertainment',
        duration: '4 hours',
        availability: 'Weekends',
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
        created_by: 'demo-user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        title: 'Event Decoration',
        description: 'Complete event decoration services including flowers, lighting, and custom themes.',
        price: 400,
        category: 'Decoration',
        duration: 'Full day',
        availability: 'All week',
        imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
        created_by: 'demo-user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        title: 'Videography Services',
        description: 'Professional event videography with cinematic quality and drone footage.',
        price: 800,
        category: 'Photography',
        duration: 'Full day',
        availability: 'Weekends',
        imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad',
        created_by: 'demo-user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        title: 'Wedding Cake Design',
        description: 'Custom wedding cakes and desserts made to order.',
        price: 200,
        category: 'Catering',
        duration: 'Per cake',
        availability: 'All week',
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
        created_by: 'demo-user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        title: 'Live Band',
        description: 'Professional live band for events with customizable playlist.',
        price: 1000,
        category: 'Entertainment',
        duration: '4 hours',
        availability: 'Weekends',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
        created_by: 'demo-user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        title: 'Floral Arrangements',
        description: 'Custom floral arrangements and centerpieces for any event.',
        price: 150,
        category: 'Decoration',
        duration: 'Per arrangement',
        availability: 'All week',
        imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d',
        created_by: 'demo-user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        title: 'Photo Booth',
        description: 'Fun photo booth with props and instant prints.',
        price: 250,
        category: 'Entertainment',
        duration: '4 hours',
        availability: 'All week',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
        created_by: 'demo-user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        title: 'Event Planning',
        description: 'Full-service event planning and coordination.',
        price: 1000,
        category: 'Planning',
        duration: 'Full service',
        availability: 'All week',
        imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
        created_by: 'demo-user',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('services', services, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('services', null, {});
  }
}; 