'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const events = [
      {
        id: 1,
        title: 'Summer Wedding Celebration',
        description: 'A beautiful summer wedding with garden ceremony and reception.',
        date: new Date('2024-07-15'),
        time: '15:00',
        location: 'Garden Venue, Tunis',
        type: 'Wedding',
        capacity: 150,
        price: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        title: 'Corporate Annual Meeting',
        description: 'Annual corporate meeting with presentations and networking.',
        date: new Date('2024-06-20'),
        time: '09:00',
        location: 'Business Center, Sousse',
        type: 'Corporate',
        capacity: 200,
        price: 3000,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        title: 'Birthday Party',
        description: 'Fun birthday celebration with games and entertainment.',
        date: new Date('2024-08-05'),
        time: '18:00',
        location: 'Party Hall, Nabeul',
        type: 'Birthday',
        capacity: 50,
        price: 800,
        imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        title: 'Product Launch',
        description: 'Exciting product launch event with demonstrations.',
        date: new Date('2024-07-01'),
        time: '14:00',
        location: 'Tech Hub, Tunis',
        type: 'Corporate',
        capacity: 100,
        price: 2000,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        title: 'Graduation Party',
        description: 'Celebration of academic achievements.',
        date: new Date('2024-06-30'),
        time: '19:00',
        location: 'University Hall, Sfax',
        type: 'Graduation',
        capacity: 120,
        price: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        title: 'Charity Gala',
        description: 'Elegant evening for a good cause.',
        date: new Date('2024-09-10'),
        time: '20:00',
        location: 'Grand Hotel, Tunis',
        type: 'Charity',
        capacity: 300,
        price: 10000,
        imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        title: 'Music Festival',
        description: 'Three-day music festival with multiple stages.',
        date: new Date('2024-08-15'),
        time: '12:00',
        location: 'Beach Park, Hammamet',
        type: 'Festival',
        capacity: 1000,
        price: 20000,
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        title: 'Food & Wine Tasting',
        description: 'Gourmet experience with local and international flavors.',
        date: new Date('2024-07-25'),
        time: '17:00',
        location: 'Wine Cellar, Nabeul',
        type: 'Food & Drink',
        capacity: 80,
        price: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 9,
        title: 'Art Exhibition',
        description: 'Contemporary art showcase with live demonstrations.',
        date: new Date('2024-09-05'),
        time: '10:00',
        location: 'Art Gallery, Sousse',
        type: 'Exhibition',
        capacity: 150,
        price: 800,
        imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afc31b2f7',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 10,
        title: 'Sports Tournament',
        description: 'Annual sports competition with multiple categories.',
        date: new Date('2024-08-20'),
        time: '08:00',
        location: 'Sports Complex, Tunis',
        type: 'Sports',
        capacity: 500,
        price: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('events', events, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('events', null, {});
  }
};